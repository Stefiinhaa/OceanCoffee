import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// As chaves que guardamos no Supabase
const SERVICE_ID = Deno.env.get('EMAILJS_SERVICE_ID');
const TEMPLATE_ID = Deno.env.get('EMAILJS_TEMPLATE_ID');

// Headers de segurança
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Recebe os dados da sua página de solicitações
    const { product_name, user_name, user_email, site_url } = await req.json();

    // Monta os dados para enviar ao EmailJS
    const data = {
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID,
      user_id: 'nlOG2UkpZAFdLuCCd', // O user_id do EmailJS, pode ser encontrado em Integration
      template_params: {
        user_name: user_name,
        user_email: user_email,
        product_name: product_name,
        site_url: site_url,
      },
    };

    // Envia a requisição para a API do EmailJS
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`EmailJS respondeu com o status: ${response.status}`);
    }

    return new Response(JSON.stringify({ message: "E-mail enviado com sucesso via EmailJS!" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});