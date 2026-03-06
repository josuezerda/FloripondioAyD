import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Tag, Users, Gift, LogOut } from 'lucide-react';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

    // Verify Admin Role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

    if (profile?.role !== 'admin') {
        redirect('/');
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-neutral-900 text-white flex flex-col hidden md:flex">
                <div className="p-6 border-b border-neutral-800 flex items-center justify-center bg-white">
                    <Link href="/" className="relative h-12 w-32 block">
                        <Image
                            src="/logo.png"
                            alt="Floripondio Logo"
                            fill
                            className="object-contain"
                        />
                    </Link>
                </div>

                <div className="p-4 flex-1">
                    <p className="text-xs uppercase tracking-wider text-neutral-500 font-bold mb-4 px-3">CMS Floripondio</p>
                    <nav className="space-y-1">
                        <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                            <Home className="h-5 w-5" />
                            Dashboard
                        </Link>
                        <Link href="/admin/promos" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                            <Tag className="h-5 w-5" />
                            Promociones
                        </Link>
                        <Link href="/admin/memberships" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                            <Gift className="h-5 w-5" />
                            Membresías
                        </Link>
                    </nav>

                    <p className="text-xs uppercase tracking-wider text-neutral-500 font-bold mb-4 mt-8 px-3">Ventas</p>
                    <nav className="space-y-1">
                        <Link href="/admin/subscriptions" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
                            <Users className="h-5 w-5" />
                            Suscripciones VIP
                        </Link>
                    </nav>
                </div>

                <div className="p-4 border-t border-neutral-800">
                    <div className="flex items-center justify-between px-3">
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">{session.user.email}</span>
                            <span className="text-xs text-[#FF4F8B]">Administrador</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-white border-b border-gray-200 h-16 flex items-center px-4 justify-between">
                    <div className="relative h-8 w-24">
                        <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                    </div>
                    <span className="text-xs bg-[#FF4F8B] text-white px-2 py-1 rounded">Admin</span>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
