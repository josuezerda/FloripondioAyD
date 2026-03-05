import { Mail, Lock, ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-neutral-50 dark:bg-neutral-950 p-4 font-sans text-neutral-900 dark:text-neutral-100">

            {/* Background decoration */}
            <div className="absolute top-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]"></div>
                <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[100px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
                <div className="p-8">

                    <div className="mb-8 text-center space-y-2">
                        <h1 className="text-3xl font-extrabold tracking-tight">
                            Bienvenido a <span className="bg-gradient-to-r from-blue-500 to-emerald-500 text-transparent bg-clip-text">Floripondio</span>
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                            Ingresa a tu cuenta para continuar
                        </p>
                    </div>

                    <form action="#" className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium">Correo Electrónico</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-neutral-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-950/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500/50 sm:text-sm transition-all outline-none"
                                    placeholder="admin@floripondioayd.com.ar"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium">Contraseña</label>
                                <div className="text-sm">
                                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-neutral-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-950/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500/50 sm:text-sm transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 dark:focus:ring-white transition-all overflow-hidden"
                            >
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Lock className="h-5 w-5 text-neutral-500 dark:text-neutral-400 group-hover:scale-110 transition-transform" aria-hidden="true" />
                                </span>
                                Iniciar Sesión
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                                </span>
                            </button>
                        </div>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-neutral-900 text-neutral-500">O ingresa con</span>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button className="w-full flex items-center justify-center py-2.5 px-4 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm bg-white dark:bg-neutral-950 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                                <Github className="h-5 w-5 mr-2" />
                                GitHub
                            </button>
                        </div>
                    </div>

                </div>
                <div className="px-8 py-4 bg-neutral-50 dark:bg-neutral-950/30 border-t border-neutral-200 dark:border-neutral-800 text-center text-sm text-neutral-500">
                    ¿No tienes una cuenta?{' '}
                    <Link href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                        Regístrate aquí
                    </Link>
                </div>
            </div>
        </div>
    );
}
