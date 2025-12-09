// supabase/functions/zalo-webhook/index.ts

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  try {
    const body = await req.json();

    // Zalo gọi webhook để kiểm tra (challenge)
    if (body?.type === "challenge") {
      return new Response(
        JSON.stringify({
          code: 0,
          message: "success",
          data: { challenge: body.data.challenge }
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // User rút quyền / xoá dữ liệu
    if (body?.type === "user_revoke") {
      console.log("User revoked:", body.data.user_id);

      return new Response(
        JSON.stringify({ code: 0, message: "user revoke processed" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ code: 0, message: "ok" }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ code: -1, message: "error" }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
});
