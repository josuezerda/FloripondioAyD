'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Users, Search } from 'lucide-react';

type Subscription = {
    id: string;
    status: string;
    price: number;
    created_at: string;
    membership_plans: { name: string };
    profiles: { first_name: string; last_name: string; email: string; phone: string };
};

export default function AdminSubscriptionsPage() {
    const [subs, setSubs] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchSubs();
    }, []);

    async function fetchSubs() {
        // Join subscriptions with profiles and membership_plans
        const { data, error } = await supabase
            .from('subscriptions')
            .select(`
        id,
        status,
        price,
        created_at,
        membership_plans ( name ),
        profiles ( first_name, last_name, phone )
      `)
            .order('created_at', { ascending: false });

        if (data) {
            // Small hack to fetch emails if profiles query doesn't bring them from auth.users easily in a single query
            // For a real production app, either store email in profiles table or use an RPC.
            setSubs(data as unknown as Subscription[]);
        }
        setLoading(false);
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'authorized':
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">Activa</span>;
            case 'pending':
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pendiente</span>;
            case 'cancelled':
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Cancelada</span>;
            default:
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    if (loading) {
        return <div className="p-8 text-neutral-500">Cargando suscripciones...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                    <Users className="text-[#FF4F8B]" />
                    Suscripciones Activas
                </h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar suscriptor..."
                        className="pl-10 pr-4 py-2 bg-white text-neutral-900 border border-gray-200 rounded-full focus:ring-[#FF4F8B] focus:border-[#FF4F8B] text-sm w-full sm:w-64"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contacto</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Plan</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {subs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No hay suscripciones registradas todavía.
                                    </td>
                                </tr>
                            ) : (
                                subs.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {sub.profiles?.first_name} {sub.profiles?.last_name}
                                            </div>
                                            <div className="text-sm text-gray-500 text-xs mt-0.5 font-mono">{sub.id.substring(0, 8)}...</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{sub.profiles?.phone || 'Sin teléfono'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-gray-900">{sub.membership_plans?.name}</span>
                                                <span className="text-sm text-gray-500">(${sub.price.toLocaleString('es-AR')})</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(sub.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(sub.created_at).toLocaleDateString('es-AR', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
