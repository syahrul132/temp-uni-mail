
-- Update profile default balance to 3 (free credits on signup)
ALTER TABLE public.profiles ALTER COLUMN balance SET DEFAULT 3;

-- Add unlimited_until to profiles (for premium subscription)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS unlimited_until timestamptz;

-- Update handle_new_user trigger to grant 3 credits + create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, balance)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email), 3);
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

-- Ensure trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- API keys table
CREATE TABLE IF NOT EXISTS public.api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL DEFAULT 'Default',
  key_hash text NOT NULL UNIQUE,
  key_prefix text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  last_used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own api keys" ON public.api_keys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own api keys" ON public.api_keys FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own api keys" ON public.api_keys FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users update own api keys" ON public.api_keys FOR UPDATE USING (auth.uid() = user_id);

-- Admin can view everything via has_role
CREATE POLICY "Admins view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update all profiles" ON public.profiles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins view all temp_emails" ON public.temp_emails FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins view all transactions" ON public.transactions FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RPC: deduct credit OR allow if unlimited active
CREATE OR REPLACE FUNCTION public.consume_credit_for_email(p_email_address text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_balance int;
  v_unlimited timestamptz;
  v_is_premium boolean := false;
  v_email_id uuid;
  v_expires timestamptz;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthorized');
  END IF;

  SELECT balance, unlimited_until INTO v_balance, v_unlimited
  FROM public.profiles WHERE user_id = v_user FOR UPDATE;

  IF v_unlimited IS NOT NULL AND v_unlimited > now() THEN
    v_is_premium := true;
    v_expires := v_unlimited;
  ELSE
    IF v_balance < 1 THEN
      RETURN jsonb_build_object('success', false, 'error', 'insufficient_credits');
    END IF;
    UPDATE public.profiles SET balance = balance - 1 WHERE user_id = v_user;
    v_expires := now() + interval '24 hours';
  END IF;

  INSERT INTO public.temp_emails (user_id, email_address, is_premium, expires_at)
  VALUES (v_user, p_email_address, v_is_premium, v_expires)
  RETURNING id INTO v_email_id;

  RETURN jsonb_build_object('success', true, 'email_id', v_email_id, 'is_premium', v_is_premium, 'expires_at', v_expires);
END;
$$;

-- RPC: grant unlimited (called after successful payment) - for now manually triggered
CREATE OR REPLACE FUNCTION public.grant_unlimited_subscription(p_user_id uuid, p_months int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') AND auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
  UPDATE public.profiles
  SET unlimited_until = GREATEST(COALESCE(unlimited_until, now()), now()) + (p_months || ' months')::interval
  WHERE user_id = p_user_id;
END;
$$;

-- RPC: top up credits
CREATE OR REPLACE FUNCTION public.add_credits(p_user_id uuid, p_amount int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') AND auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
  UPDATE public.profiles SET balance = balance + p_amount WHERE user_id = p_user_id;
END;
$$;
