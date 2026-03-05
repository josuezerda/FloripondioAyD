'use client';

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

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
        color: 'bg-orange-100',
        textColor: 'text-orange-800',
        borderColor: 'border-orange-200',
        buttonColor: 'bg-orange-600 hover:bg-orange-700',
    },
    Oro: {
        features: ['Decoración Avanzada', 'Asesoría prioritaria', 'Envíos gratis en compras', 'Descuento 10% en tienda'],
        color: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-200',
        buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
        popular: true,
    },
    Diamante: {
        features: ['Decoración Premium', 'Asesoramiento personalizado 24/7', 'Envíos gratis siempre', 'Descuento 25% en tienda', 'Regalo sorpresa de bienvenida'],
        color: 'bg-blue-100',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-200',
        buttonColor: 'bg-blue-600 hover:bg-blue-700',
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
            <div className="min-h-screen bg-gray-50 py-16 px-4 flex justify-center items-center">
                <p className="text-xl text-gray-500">Cargando planes de suscripción...</p>
            </div>
        );
    }

    if (plans.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-16 px-4 flex justify-center items-center">
                <p className="text-xl text-gray-500 text-center">
                    No se encontraron planes. <br />
                    Asegúrate de haber ejecutado todo el código SQL en Supabase.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Suscripciones Floripondio
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-500">
                        Elige el plan que mejor se adapte a tus necesidades de decoración.
                    </p>
                </div>

                <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-x-8">
                    {plans.map((plan) => {
                        const config = visualConfigs[plan.name] || visualConfigs['Bronce'];

                        return (
                            <div
                                key={plan.id}
                                className={`relative flex flex-col rounded-2xl border ${config.borderColor} bg-white p-8 shadow-sm transition-transform hover:scale-105`}
                            >
                                {config.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-yellow-900 shadow-sm">
                                        Más Elegido
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h3 className={`inline-flex rounded-full ${config.color} ${config.textColor} px-4 py-1 text-sm font-semibold tracking-wide uppercase`}>
                                        {plan.name}
                                    </h3>
                                    <p className="mt-6 flex items-baseline gap-x-2">
                                        <span className="text-5xl font-bold tracking-tight text-gray-900">${plan.price.toLocaleString('es-AR')}</span>
                                        <span className="text-sm font-semibold leading-6 text-gray-600">/mes</span>
                                    </p>
                                    <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
                                </div>

                                <ul role="list" className="mb-8 space-y-4 flex-1">
                                    {config.features.map((feature: string) => (
                                        <li key={feature} className="flex gap-x-3 text-sm text-gray-700">
                                            <Check className={`h-6 w-5 flex-none ${config.textColor}`} aria-hidden="true" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handleSubscribe(plan.id)}
                                    disabled={loadingPlan === plan.id}
                                    className={`mt-auto block w-full rounded-md px-3 py-3 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${config.buttonColor} disabled:opacity-70`}
                                >
                                    {loadingPlan === plan.id ? 'Procesando...' : `Elegir Plan ${plan.name}`}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
