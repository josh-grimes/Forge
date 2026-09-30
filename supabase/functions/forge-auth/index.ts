import { createClient } from "jsr:@supabase/supabase-js@2";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const usernamePattern = /^[a-z0-9](?:[a-z0-9_-]{1,22}[a-z0-9])?$/;

function response(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers });
}

function username(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function validUsername(value: string) {
  return usernamePattern.test(value);
}

function validPassword(value: unknown) {
  return typeof value === "string" && value.length >= 8;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers });
  if (request.method !== "POST") return response({ error: "METHOD_NOT_ALLOWED" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !serviceRoleKey || !anonKey)
    return response({ error: "AUTH_SERVICE_NOT_CONFIGURED" }, 503);

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const auth = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const body = await request.json();
    const action = String(body.action || "");
    const name = username(body.username);

    if (action === "delete_account") {
      const token = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
      if (!token) return response({ error: "AUTH_REQUIRED" }, 401);
      const { data: authenticated, error: authError } = await admin.auth.getUser(token);
      if (authError || !authenticated.user)
        return response({ error: "AUTH_REQUIRED" }, 401);
      const { error } = await admin.auth.admin.deleteUser(authenticated.user.id);
      if (error) return response({ error: "ACCOUNT_NOT_DELETED" }, 500);
      return response({ deleted: true });
    }

    if (action === "sign_in") {
      if (!validUsername(name) || !validPassword(body.password))
        return response({ error: "INVALID_CREDENTIALS" }, 400);
      const { data: profile } = await admin
        .from("forge_user_profiles")
        .select("user_id")
        .eq("username", name)
        .maybeSingle();
      if (!profile) return response({ error: "INVALID_CREDENTIALS" }, 401);
      const { data: account } = await admin.auth.admin.getUserById(profile.user_id);
      const email = account.user?.email;
      if (!email) return response({ error: "INVALID_CREDENTIALS" }, 401);
      const { data, error } = await auth.auth.signInWithPassword({
        email,
        password: body.password,
      });
      if (error || !data.session) return response({ error: "INVALID_CREDENTIALS" }, 401);
      return response({ session: data.session });
    }

    if (action === "sign_up") {
      const email = String(body.email || "").trim().toLowerCase();
      if (!validUsername(name) || !validPassword(body.password) || !email.includes("@"))
        return response({ error: "INVALID_ACCOUNT_DETAILS" }, 400);
      const { data: existing } = await admin
        .from("forge_user_profiles")
        .select("user_id")
        .eq("username", name)
        .maybeSingle();
      if (existing) return response({ error: "USERNAME_TAKEN" }, 409);
      const { data: created, error: createError } = await admin.auth.admin.createUser({
        email,
        password: body.password,
        email_confirm: false,
        user_metadata: { username: name },
      });
      if (createError || !created.user) return response({ error: "ACCOUNT_NOT_CREATED" }, 400);
      const { error: profileError } = await admin.from("forge_user_profiles").insert({
        user_id: created.user.id,
        username: name,
        recovery_email: email,
      });
      if (profileError) {
        await admin.auth.admin.deleteUser(created.user.id);
        return response({ error: profileError.code === "23505" ? "USERNAME_TAKEN" : "ACCOUNT_NOT_CREATED" }, 409);
      }
      return response({ requiresEmailConfirmation: true });
    }

    if (action === "recover") {
      const email = String(body.email || "").trim().toLowerCase();
      if (!email.includes("@")) return response({ error: "INVALID_EMAIL" }, 400);
      const { error } = await auth.auth.resetPasswordForEmail(email, {
        redirectTo: String(body.redirectTo || supabaseUrl),
      });
      if (error) return response({ error: "RECOVERY_UNAVAILABLE" }, 400);
      return response({ sent: true });
    }

    return response({ error: "UNKNOWN_ACTION" }, 400);
  } catch (error) {
    console.error(error);
    return response({ error: "AUTH_REQUEST_FAILED" }, 500);
  }
});
