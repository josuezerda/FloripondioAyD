import { NextRequest, NextResponse } from 'next/server';
import { PreApproval, MercadoPagoConfig } from 'mercadopago';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Make sure to add this in .env.local: MERCADOPAGO_ACCESS_TOKEN
const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '' });
const preapproval = new PreApproval(client);

export async function POST(req: NextRequest) {
    try {
        const { plan_id } = await req.json();

        if (!plan_id) {
            return NextResponse.json({ error: 'Plan ID es requerido' }, { status: 400 });
        }

        // Get current user via Supabase
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
                    },
                },
            }
        );

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'No autorizado. Debes iniciar sesión primero.' }, { status: 401 });
        }

        // Get plan details from DB
        const { data: planDetails, error: planError } = await supabase
            .from('membership_plans')
            .select('*')
            .eq('id', plan_id)
            .single();

        if (planError || !planDetails) {
            return NextResponse.json({ error: 'Plan inválido o no encontrado en la base de datos' }, { status: 404 });
        }

        // 1. Create Preapproval in Mercado Pago
        // We pass external_reference as a custom payload to identify the user and plan later on webhook
        const externalReference = JSON.stringify({
            user_id: user.id,
            plan_id: planDetails.id,
        });

        const response = await preapproval.create({
            body: {
                reason: `Suscripción Mensual - Plan ${planDetails.name}`,
                auto_recurring: {
                    frequency: 1,
                    frequency_type: 'months',
                    transaction_amount: Number(planDetails.price),
                    currency_id: 'ARS', // Change to your local currency if not ARS
                },
                back_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/memberships?success=true`,
                external_reference: externalReference,
                status: 'pending',
            }
        });

        // We return the init_point so frontend can redirect
        return NextResponse.json({ init_point: response.init_point });
    } catch (error: any) {
        console.error('Error creating MP subscription:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
