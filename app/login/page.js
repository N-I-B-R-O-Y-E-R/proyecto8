'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
// Asume que ya creaste lib/supabase.client.js
import { supabaseClient } from '@/lib/supabase.client'; 

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Obtiene el email de la Landing Page si existe
    const initialEmail = searchParams.get('email') || ''; 
    
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(true); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Si llega un email desde la Landing, asume registro
    useEffect(() => {
        if (initialEmail) {
            setIsSignUp(true);
        }
    }, [initialEmail]);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        let authFunction = isSignUp ? supabaseClient.auth.signUp : supabaseClient.auth.signInWithPassword;
        
        const { error: authError } = await authFunction({ email, password });
        
        if (authError) {
            setError(authError.message);
        } else {
            // Éxito: redirige a la Home (que crearás después)
            router.push('/home'); 
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#040714] p-6">
            <Image src="/images/disney_logo.png" alt={"Disney+ Logo"} width={112} height={44} priority style={{ width: 'auto', height: 'auto', display: 'block', marginBottom: '2.5rem' }} />
            
            <div className="bg-[#151924] p-10 rounded-lg shadow-xl w-full max-w-md">
                <h1 className="text-2xl font-bold text-white mb-6 text-center">
                    {isSignUp ? 'Regístrate' : 'Iniciar Sesión'}
                </h1>
                
                {error && (
                    <div className="bg-red-900/50 text-red-300 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-6">
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-4 bg-gray-700/80 rounded border border-gray-600 text-white focus:outline-none focus:border-cyan-500"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-4 bg-gray-700/80 rounded border border-gray-600 text-white focus:outline-none focus:border-cyan-500"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-500 text-black font-bold py-3 rounded transition hover:bg-opacity-90 disabled:opacity-50"
                    >
                        {loading ? 'Cargando...' : isSignUp ? 'REGISTRARME' : 'INICIAR SESIÓN'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    <p>
                        {isSignUp ? '¿Ya tienes cuenta?' : '¿Nuevo en Disney Clone?'}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-cyan-500 font-semibold ml-1 hover:underline"
                        >
                            {isSignUp ? 'Inicia Sesión' : 'Regístrate ahora'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}