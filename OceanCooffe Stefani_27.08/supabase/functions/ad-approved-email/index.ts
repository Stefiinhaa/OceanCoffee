import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Headers para permitir que seu site chame esta função
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Para produção, troque '*' pela URL do seu site
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// SUBSTITUA PELA URL REAL E COMPLETA DO SEU SITE
const SITE_URL = "https://ocean-coffee.vercel.app/meus-anuncios.html"; 

console.log("Função 'ad-approved-email' pronta para receber chamadas!");

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { product_name, user_name, user_id } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(user_id);
    if (userError) throw new Error(`Erro ao buscar usuário: ${userError.message}`);

    const user_email = userData.user.email;
    if (!user_email) throw new Error("Usuário não possui um e-mail cadastrado.");

    const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
        user_email,
        { data: { 
            email_content: `
              <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #0047a3;">Olá, ${user_name}! Boas notícias!</h2>
                <p>Seu anúncio para o produto "<strong>${product_name}</strong>" foi aprovado e já está visível para todos em nossa plataforma.</p>
                <p>Você pode visualizá-lo e gerenciá-lo a qualquer momento na sua conta.</p>
                <a href="${SITE_URL}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #0047a3; color: white; text-decoration: none; border-radius: 5px;">
                  Ver Meus Anúncios
                </a>
                <p style="font-size: 14px;">Agradecemos por usar a Ocean Coffee!</p>
                <p style="font-size: 14px;">Atenciosamente,<br>Equipe Ocean Coffee</p>
              </div>
            `,
            subject: `Seu anúncio "${product_name}" foi aprovado!` 
          } 
        }
    );

    if (error) throw error;

    return new Response(JSON.stringify({ message: "E-mail de aprovação enviado com sucesso!" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Erro na função:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});