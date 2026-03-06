'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError('Credenciales inválidas. Por favor, intenta de nuevo.');
            setIsLoading(false);
            return;
        }

        // Check if user is admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', authData.user?.id)
            .single();

        if (profile?.role === 'admin') {
            router.refresh(); // Ensure Server Components get the fresh cookie
            router.push('/admin');
        } else {
            router.refresh();
            router.push('/');
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF0F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative Blur */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFE4EE] rounded-full filter blur-3xl opacity-70 -translate-y-1/2 translate-x-1/3 z-0"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 flex flex-col items-center">
                <Link href="/" className="mb-6 block relative h-20 w-48">
                    <Image
                        src="/logo.png"
                        alt="Floripondio Logo"
                        fill
                        className="object-contain"
                    />
                </Link>
                <h2 className="mt-2 text-center text-3xl font-extrabold text-neutral-900 font-['var(--font-just-hello)'] tracking-wide">
                    Acceso Administrador
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-[2rem] sm:px-10 border border-pink-100">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 bg-white text-neutral-900 border border-neutral-200 rounded-xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-[#FF4F8B] focus:border-[#FF4F8B] sm:text-sm transition-colors"
                                    placeholder="ejemplo@floripondioayd.com.ar"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                                Contraseña
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 bg-white text-neutral-900 border border-neutral-200 rounded-xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-[#FF4F8B] focus:border-[#FF4F8B] sm:text-sm transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-[#FF4F8B] hover:bg-[#E11D62] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4F8B] disabled:opacity-70 transition-all"
                            >
                                {isLoading ? 'Comprobando...' : 'Iniciar Sesión'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
