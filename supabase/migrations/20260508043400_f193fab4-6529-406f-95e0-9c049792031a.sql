
REVOKE EXECUTE ON FUNCTION public.consume_credit_for_email(text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.grant_unlimited_subscription(uuid, int) FROM anon;
REVOKE EXECUTE ON FUNCTION public.add_credits(uuid, int) FROM anon;
