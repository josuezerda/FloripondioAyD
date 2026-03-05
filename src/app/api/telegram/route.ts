import { NextRequest, NextResponse } from 'next/server';
import { Telegraf, Context } from 'telegraf';

// Initialize bot with Token
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');

// Basic bot logic
bot.start((ctx: Context) => ctx.reply('¡Hola! Soy tu nuevo agente de Telegram.'));
bot.on('text', (ctx: Context) => ctx.reply(`Recibí tu mensaje: ${// @ts-ignore
    ctx.message?.text}`));

export async function POST(req: NextRequest) {
    try {
        // Validation: Verify secret path or token match
        const secretPath = req.nextUrl.searchParams.get('secret');
        if (secretPath !== process.env.TELEGRAM_BOT_TOKEN) {
            return new NextResponse('Unauthorized', { status: 403 });
        }

        const body = await req.json();
        await bot.handleUpdate(body);
        return new NextResponse('OK', { status: 200 });
    } catch (error) {
        console.error('Error handling telegram update:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
