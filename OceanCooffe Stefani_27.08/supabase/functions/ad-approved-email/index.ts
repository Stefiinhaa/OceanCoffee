import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { product_name, user_name, user_email, site_url } = await req.json();

    // Pega todas as chaves secretas do ambiente
    const SERVICE_ID = Deno.env.get('EMAILJS_SERVICE_ID');
    const TEMPLATE_ID = Deno.env.get('EMAILJS_TEMPLATE_ID');
    const USER_ID = Deno.env.get('EMAILJS_USER_ID');
    const PRIVATE_KEY = Deno.env.get('EMAILJS_PRIVATE_KEY'); // <-- Nova chave

    if (!SERVICE_ID || !TEMPLATE_ID || !USER_ID || !PRIVATE_KEY) {
      throw new Error("Uma ou mais chaves do EmailJS não foram configuradas como 'secrets'. Verifique todas as quatro: SERVICE_ID, TEMPLATE_ID, USER_ID, PRIVATE_KEY.");
    }

    // Monta o corpo da requisição, incluindo o "accessToken"
    const data = {
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID,
      user_id: USER_ID,
      accessToken: PRIVATE_KEY, // <-- Autenticação para o servidor
      template_params: {
        user_name: user_name,
        user_email: user_email,
        product_name: product_name,
        site_url: site_url,
      },
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`O EmailJS respondeu com um erro: ${errorBody}`);
    }

    return new Response(JSON.stringify({ message: "E-mail enviado com sucesso!" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Erro na Edge Function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});