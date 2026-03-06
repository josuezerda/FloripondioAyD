'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Tag, Save, AlertCircle } from 'lucide-react';

type Promo = {
    id: string;
    title: string;
    description: string;
    price: number;
    real_price: number;
    is_active: boolean;
};

export default function AdminPromosPage() {
    const [promos, setPromos] = useState<Promo[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const supabase = createClient();

    useEffect(() => {
        fetchPromos();
    }, []);

    async function fetchPromos() {
        const { data, error } = await supabase.from('promos').select('*').order('id');
        if (data) setPromos(data);
        setLoading(false);
    }

    const handleUpdate = async (id: string) => {
        setSavingId(id);
        setMessage(null);

        const promo = promos.find(p => p.id === id);
        if (!promo) return;

        const { error } = await supabase
            .from('promos')
            .update({
                title: promo.title,
                description: promo.description,
                price: promo.price,
                real_price: promo.real_price,
                is_active: promo.is_active
            })
            .eq('id', id);

        if (error) {
            setMessage({ text: 'Error al cambiar la promoción.', type: 'error' });
        } else {
            setMessage({ text: 'Promoción actualizada con éxito.', type: 'success' });
        }

        setSavingId(null);
        // Hide message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
    };

    const handleChange = (id: string, field: keyof Promo, value: any) => {
        setPromos(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    if (loading) {
        return <div className="p-8 text-neutral-500">Cargando promociones...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                    <Tag className="text-[#FF4F8B]" />
                    Gestor de Promos (Floripondio Fest)
                </h1>
            </div>

            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                    <AlertCircle className="w-5 h-5" />
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {promos.map((promo) => (
                    <div key={promo.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col space-y-4">
                        <div className="font-bold text-lg text-gray-500 uppercase tracking-widest border-b pb-2 mb-2">ID: {promo.id}</div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Título del Combo</label>
                            <input
                                type="text"
                                value={promo.title}
                                onChange={(e) => handleChange(promo.id, 'title', e.target.value)}
                                className="w-full px-4 py-2 bg-white text-neutral-900 border rounded-xl focus:ring-[#FF4F8B] focus:border-[#FF4F8B]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción corta</label>
                            <textarea
                                value={promo.description}
                                onChange={(e) => handleChange(promo.id, 'description', e.target.value)}
                                rows={2}
                                className="w-full px-4 py-2 bg-white text-neutral-900 border rounded-xl focus:ring-[#FF4F8B] focus:border-[#FF4F8B]"
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Precio Promo ($)</label>
                                <input
                                    type="number"
                                    value={promo.price}
                                    onChange={(e) => handleChange(promo.id, 'price', Number(e.target.value))}
                                    className="w-full px-4 py-2 bg-white text-neutral-900 border rounded-xl focus:ring-[#FF4F8B] focus:border-[#FF4F8B]"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Precio Real (Tachado $)</label>
                                <input
                                    type="number"
                                    value={promo.real_price}
                                    onChange={(e) => handleChange(promo.id, 'real_price', Number(e.target.value))}
                                    className="w-full px-4 py-2 bg-white text-neutral-900 border rounded-xl focus:ring-[#FF4F8B] focus:border-[#FF4F8B]"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id={`active-${promo.id}`}
                                checked={promo.is_active}
                                onChange={(e) => handleChange(promo.id, 'is_active', e.target.checked)}
                                className="w-5 h-5 text-[#FF4F8B] focus:ring-[#FF4F8B] border-gray-300 rounded"
                            />
                            <label htmlFor={`active-${promo.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">
                                Promo Activa (Visible en la web)
                            </label>
                        </div>

                        <div className="pt-4 border-t">
                            <button
                                onClick={() => handleUpdate(promo.id)}
                                disabled={savingId === promo.id}
                                className="flex items-center justify-center w-full gap-2 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors"
                            >
                                <Save className="w-5 h-5" />
                                {savingId === promo.id ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
