'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Gift, Save, AlertCircle } from 'lucide-react';

type Membership = {
    id: string;
    name: string;
    price: number;
    description: string;
};

export default function AdminMembershipsPage() {
    const [plans, setPlans] = useState<Membership[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const supabase = createClient();

    useEffect(() => {
        fetchPlans();
    }, []);

    async function fetchPlans() {
        const { data, error } = await supabase.from('membership_plans').select('*').order('price');
        if (data) setPlans(data);
        setLoading(false);
    }

    const handleUpdate = async (id: string) => {
        setSavingId(id);
        setMessage(null);

        const plan = plans.find(p => p.id === id);
        if (!plan) return;

        const { error } = await supabase
            .from('membership_plans')
            .update({
                name: plan.name,
                description: plan.description,
                price: plan.price
            })
            .eq('id', id);

        if (error) {
            setMessage({ text: 'Error al cambiar la membresía.', type: 'error' });
        } else {
            setMessage({ text: 'Membresía actualizada con éxito.', type: 'success' });
        }

        setSavingId(null);
        setTimeout(() => setMessage(null), 3000);
    };

    const handleChange = (id: string, field: keyof Membership, value: any) => {
        setPlans(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    if (loading) {
        return <div className="p-8 text-neutral-500">Cargando planes...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                    <Gift className="text-[#FF4F8B]" />
                    Gestor de Membresías (Planes VIP)
                </h1>
            </div>

            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                    <AlertCircle className="w-5 h-5" />
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <div key={plan.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col space-y-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Plan</label>
                            <input
                                type="text"
                                value={plan.name}
                                onChange={(e) => handleChange(plan.id, 'name', e.target.value)}
                                className="w-full px-4 py-2 font-bold bg-white text-neutral-900 border rounded-xl focus:ring-[#FF4F8B] focus:border-[#FF4F8B]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Precio Mensual ($)</label>
                            <input
                                type="number"
                                value={plan.price}
                                onChange={(e) => handleChange(plan.id, 'price', Number(e.target.value))}
                                className="w-full px-4 py-2 bg-white text-neutral-900 border rounded-xl focus:ring-[#FF4F8B] focus:border-[#FF4F8B] font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción corta</label>
                            <textarea
                                value={plan.description || ''}
                                onChange={(e) => handleChange(plan.id, 'description', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 bg-white text-neutral-900 border rounded-xl focus:ring-[#FF4F8B] focus:border-[#FF4F8B] text-sm"
                            />
                        </div>

                        <div className="pt-4 border-t mt-auto">
                            <button
                                onClick={() => handleUpdate(plan.id)}
                                disabled={savingId === plan.id}
                                className="flex items-center justify-center w-full gap-2 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors"
                            >
                                <Save className="w-5 h-5" />
                                {savingId === plan.id ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
