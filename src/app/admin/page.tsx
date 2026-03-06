import { createClient } from '@/utils/supabase/server';
import { Sparkles, Users, Calendar, TrendingUp } from 'lucide-react';

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Basic counters
    const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: subsCount } = await supabase.from('subscriptions').select('*', { count: 'exact', head: true });

    const stats = [
        { title: 'Usuarios Registrados', value: usersCount || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { title: 'Suscripciones Activas', value: subsCount || 0, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard General</h1>
                <div className="bg-pink-100 text-pink-800 text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Hola, Administrador
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className={`${stat.bg} ${stat.color} p-4 rounded-xl`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Bienvenido al Panel de Control Floripondio</h2>
                <p className="text-gray-600">
                    Desde aquí puedes administrar el contenido de tu plataforma.
                    Utiliza el menú lateral para acceder a la configuración de <strong>Promociones</strong> (Floripondio Fest)
                    y <strong>Membresías</strong> (Suscripciones Mensuales). Cualquier cambio que realices aquí se verá reflejado inmediatamente en la página web pública.
                </p>
            </div>
        </div>
    );
}
