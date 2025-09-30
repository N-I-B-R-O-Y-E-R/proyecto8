'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image'; 
import { supabaseClient } from '@/lib/supabase.client'; 

export default function AuthPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const initialEmail = searchParams.get('email') || ''; 
    
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialEmail) {
            setEmail(initialEmail);
        }
    }, [initialEmail]);

    const checkProfileAndRedirect = async (session) => {
        setLoading(true);
        const { data: profileData, error: profileError } = await supabaseClient
            .from('profiles')
            .select('username')
            .eq('id', session.user.id)
            .single();

        setLoading(false);

        if (profileError && profileError.code !== 'PGRST116') { 
            console.error('Error fetching profile:', profileError);
            router.replace('/home'); 
            return;
        }

        if (profileData && profileData.username) {
            router.replace('/home'); 
        } else {
            router.replace('/profile-setup'); 
        }
    };


    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let session = null;
            
            const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({ 
                email, 
                password 
            });

            if (signInData.user) {
                session = signInData.session;
            } 
            
            else if (signInError && (signInError.message.includes("Invalid login credentials") || signInError.message.includes("does not exist"))) {
                const { data: signUpData, error: signUpError } = await supabaseClient.auth.signUp({ 
                    email, 
                    password 
                });

                if (signUpError) {
                    throw signUpError; 
                }
                session = signUpData.session;
            } 
            
            else if (signInError) {
                throw signInError;
            }
            
            if (session) {
                await checkProfileAndRedirect(session);
            }


        } catch (authError) {
            console.error("Auth Error:", authError);
            setError("Authentication failed. Please check your email and password or try again.");
        } finally {
            setLoading(false); 
        }
    };


    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#040714] p-6">
            <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-md">
                
                <div className="mx-auto mb-6 w-24 h-24 relative">
                    <Image 
                        src="/images/logo_dark.png" 
                        alt={"My Disney Logo"} 
                        width={96}
                        height={96}
                        priority
                        style={{ width: 'auto', height: 'auto', display: 'block' }}
                    />
                </div>
                
                <div className="text-center mb-6">
                    <h1 className="text-xl font-bold text-gray-800 mb-2">
                        Enter your email to continue
                    </h1>
                    <p className="text-sm text-gray-500">
                        Log in to Disney+ with your MyDisney account. If you **don&apos;t** have one, you will be prompted to create one.
                    </p>
                </div>
                
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 bg-gray-100 border-none rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 bg-gray-100 border-none rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-500 text-black font-bold py-3 rounded transition hover:bg-cyan-600 disabled:bg-gray-400"
                    >
                        {loading ? 'Processing...' : 'Continue'}
                    </button>
                    
                    <div className="text-xs text-center text-gray-400 mt-4">
                        <span className="underline cursor-pointer hover:text-gray-600">Forgot your password?</span>
                    </div>

                </form>
            </div>
        </div>
    );
}