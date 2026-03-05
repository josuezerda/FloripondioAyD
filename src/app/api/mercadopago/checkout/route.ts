import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// MP client setup
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN || 'APP_USR-3691517943003613-030516-811892c5e785072481026fbccfbdeebf-126707264'
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, price, description } = body;

        const preference = new Preference(client);

        const host = request.headers.get('host');
        const protocol = host?.includes('localhost') ? 'http' : 'https';
        const baseUrl = `${protocol}://${host}`;

        const result = await preference.create({
            body: {
                items: [
                    {
                        id: 'promo_500k',
                        title: title || 'Promo Decoración',
                        description: description || 'Decoración mini escenográfica',
                        quantity: 1,
                        unit_price: Number(price),
                        currency_id: 'ARS',
                    }
                ],
                back_urls: {
                    success: `${baseUrl}/?payment_status=success`,
                    failure: `${baseUrl}/?payment_status=failure`,
                    pending: `${baseUrl}/?payment_status=pending`
                },
                auto_return: 'approved',
            }
        });

        return NextResponse.json({ url: result.init_point });
    } catch (error: any) {
        console.error('Error creating MP preference:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
