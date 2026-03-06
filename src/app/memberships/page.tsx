'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import Image from 'next/image';

type MembershipPlan = {
    id: string;
    name: string;
    price: number;
    description: string;
};

// Hardcoded visual features because they typically are too complex for a DB simple table
// We map these to the plan name coming from the database.
const visualConfigs: Record<string, any> = {
    Bronce: {
        features: ['Decoración Base', 'Asesoría vía Telegram', 'Acceso a boletín mensual'],
        bgColor: 'bg-white',
        textColor: 'text-neutral-800',
        priceColor: 'text-[#FF4F8B]',
        buttonClass: 'bg-pink-50 text-[#FF4F8B] hover:bg-pink-100',
        popular: false,
        accent: 'border-pink-100',
    },
    Oro: {
        features: ['Decoración Avanzada', 'Asesoría prioritaria', 'Envíos gratis en compras', 'Descuento 10% en tienda'],
        bgColor: 'bg-[#FF4F8B]',
        textColor: 'text-white',
        priceColor: 'text-white',
        buttonClass: 'bg-white text-[#FF4F8B] hover:bg-pink-50 shadow-md',
        popular: true,
        accent: 'border-transparent',
    },
    Diamante: {
        features: ['Decoración Premium', 'Asesoramiento personalizado 24/7', 'Envíos gratis siempre', 'Descuento 25% en tienda', 'Regalo sorpresa de bienvenida'],
        bgColor: 'bg-[#111]',
        textColor: 'text-white',
        priceColor: 'text-white',
        buttonClass: 'bg-neutral-800 text-white hover:bg-neutral-700',
        popular: false,
        accent: 'border-neutral-800',
    },
};

export default function MembershipsPage() {
    const [plans, setPlans] = useState<MembershipPlan[]>([]);
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch plans directly from Supabase DB on client load
    useEffect(() => {
        async function loadPlans() {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('membership_plans')
                .select('*')
                .order('price', { ascending: true }); // Bronce, Oro, Diamante

            if (data) {
                setPlans(data as MembershipPlan[]);
            }
            setIsLoading(false);
        }
        loadPlans();
    }, []);

    const handleSubscribe = async (planId: string) => {
        setLoadingPlan(planId);
        try {
            const response = await fetch('/api/mercadopago/subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan_id: planId }),
            });

            const data = await response.json();

            if (data.init_point) {
                window.location.href = data.init_point;
            } else {
                alert(data.error || 'Hubo un error al generar la suscripción.');
            }
        } catch (error) {
            console.error('Error in subscription:', error);
            alert('Hubo un problema de conexión.');
        } finally {
            setLoadingPlan(null);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FFF0F5] relative flex flex-col justify-center items-center overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFE4EE] rounded-full filter blur-3xl opacity-70 -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FFE4EE] rounded-full filter blur-3xl opacity-70 translate-y-1/3 -translate-x-1/4"></div>
                <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin z-10"></div>
                <p className="mt-4 text-xl font-light text-rose-500 z-10">Cargando planes mágicos...</p>
            </div>
        );
    }

    if (plans.length === 0) {
        return (
            <div className="min-h-screen bg-[#FFF0F5] relative flex flex-col justify-center items-center overflow-hidden text-center px-4">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFE4EE] rounded-full filter blur-3xl opacity-70 -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FFE4EE] rounded-full filter blur-3xl opacity-70 translate-y-1/3 -translate-x-1/4"></div>
                <p className="text-2xl font-['var(--font-just-hello)'] text-[#E11D62] z-10">
                    Aún no hay planes disponibles.
                </p>
                <Link href="/" className="mt-8 z-10 underline text-rose-500 hover:text-rose-700">Volver al Inicio</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFF0F5] selection:bg-rose-200 font-sans text-neutral-800">

            {/* 
        ====================================================================
        HEADER / NAVIGATION (Pink Theme)
        ====================================================================
      */}
            <header className="sticky top-0 z-50 w-full bg-[#FF4F8B] text-white shadow-md">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="relative h-14 w-40">
                                <Image
                                    src="/logo.png"
                                    alt="Floripondio Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
                            <Link href="/" className="hover:text-pink-200 transition-colors">Volver al Inicio</Link>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-hidden relative pb-32">
                {/* Subtle background decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFE4EE] rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-y-1/2 translate-x-1/3 z-0 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FFE4EE] rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-y-1/3 -translate-x-1/4 z-0 pointer-events-none"></div>

                <div className="container px-4 md:px-8 mx-auto relative z-10 text-center flex flex-col items-center pt-20">
                    <div className="inline-flex items-center rounded-full bg-white/60 backdrop-blur-md px-4 py-1.5 text-sm text-[#E11D62] mb-8 shadow-sm">
                        <Sparkles className="mr-2 h-4 w-4 fill-[#E11D62]" />
                        <span className="font-semibold tracking-wide">Beneficios Exclusivos</span>
                    </div>

                    <h1 className="font-['var(--font-just-hello)'] text-6xl md:text-8xl text-[#E11D62] mb-6 drop-shadow-sm">
                        Membresías VIP
                    </h1>

                    <p className="max-w-3xl mx-auto text-neutral-700 text-lg md:text-xl font-light mb-20 leading-relaxed">
                        Únete a nuestros planes mensuales y obtén decoraciones increíbles garantizadas para tus eventos del año, a un precio preferencial y con Mercado Pago.
                    </p>

                    {/* Pricing Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left w-full">
                        {plans.map((plan) => {
                            const config = visualConfigs[plan.name] || visualConfigs['Bronce'];

                            return (
                                <div
                                    key={plan.id}
                                    className={`relative flex flex-col rounded-[2.5rem] p-10 shadow-lg border ${config.bgColor} ${config.textColor} ${config.accent} hover:shadow-2xl transition-all duration-300 transform md:hover:-translate-y-2`}
                                >
                                    {config.popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-6 py-1.5 text-xs font-extrabold uppercase tracking-wide text-yellow-900 shadow-xl border-2 border-white">
                                            Más Elegido
                                        </div>
                                    )}

                                    <div className="mb-8">
                                        <h3 className="text-3xl font-bold mb-2 font-['var(--font-just-hello)'] tracking-wide">{plan.name}</h3>
                                        <div className="flex items-end gap-x-2 mt-4">
                                            <span className={`text-4xl lg:text-5xl font-extrabold tracking-tight ${config.priceColor}`}>
                                                ${plan.price.toLocaleString('es-AR')}
                                            </span>
                                            <span className={`text-sm font-semibold mb-1 opacity-80`}>/ mes</span>
                                        </div>
                                        <p className={`mt-6 text-[15px] leading-relaxed opacity-90 min-h-[50px]`}>
                                            {plan.description}
                                        </p>
                                    </div>

                                    <ul role="list" className="mb-10 space-y-5 flex-1 mt-4 border-t border-current/10 pt-8">
                                        {config.features.map((feature: string) => (
                                            <li key={feature} className="flex gap-x-3 items-start">
                                                <ShieldCheck className="h-6 w-6 flex-none shrink-0" aria-hidden="true" />
                                                <span className="text-sm md:text-base leading-snug">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={() => handleSubscribe(plan.id)}
                                        disabled={loadingPlan === plan.id}
                                        className={`mt-auto block w-full rounded-full px-6 py-4 text-center font-bold text-lg shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100 disabled:hover:-translate-y-0 hover:-translate-y-1 ${config.buttonClass}`}
                                    >
                                        {loadingPlan === plan.id ? 'Procesando pago...' : `Suscribirse`}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Trust badges below */}
                    <div className="mt-20 flex flex-col items-center space-y-4">
                        <p className="text-sm font-medium text-neutral-500 uppercase tracking-widest">Pagos seguros certificados por</p>
                        <div className="flex gap-6 items-center opacity-60 grayscale hover:grayscale-0 transition-all">
                            <Image src="/Logo  imagens y Tipografia/Logo_nov.png" alt="Mercado Pago" width={100} height={30} className="object-contain" />
                        </div>
                    </div>
                </div>
            </main>

            {/* 
        ====================================================================
        FOOTER (Pink Theme)
        ====================================================================
      */}
            <footer className="w-full py-12 px-6 bg-white border-t border-pink-100 text-neutral-600">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">

                    <div className="flex flex-col items-center md:items-start space-y-4">
                        <div className="relative h-20 w-48">
                            <Image
                                src="/logo.png"
                                alt="Floripondio Logo"
                                fill
                                className="object-contain drop-shadow-sm"
                            />
                        </div>
                        <p className="text-sm max-w-xs">
                            Decoraciones y ambientaciones únicas llenas de amor y detalles para tus celebraciones.
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-start">
                        <h4 className="font-bold text-[#FF4F8B] mb-4 uppercase tracking-wider text-sm">Navegación</h4>
                        <ul className="space-y-3">
                            <li><Link href="/" className="hover:text-[#E11D62] transition-colors">Volver al Inicio</Link></li>
                        </ul>
                    </div>

                    <div className="flex flex-col items-center md:items-start">
                        <h4 className="font-bold text-[#FF4F8B] mb-4 uppercase tracking-wider text-sm">Contacto</h4>
                        <ul className="space-y-3">
                            <li>+54 9 3855-196364</li>
                            <li>info@floripondio.com</li>
                            <li>Moreno Norte 285 esquina Formosa<br />Santiago del Estero</li>
                        </ul>
                    </div>

                </div>

                <div className="container mx-auto mt-12 pt-6 border-t border-pink-200 text-center text-sm">
                    © {new Date().getFullYear()} Floripondio. Todos los derechos reservados.
                </div>
            </footer>
        </div>
    );
}
