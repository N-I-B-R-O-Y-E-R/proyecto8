'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabase.client'; 
import Image from 'next/image';

const disneyAvatars = [
    { id: 1, name: 'Mickey', url: '/images/avatar1.png' },
    { id: 2, name: 'Minnie', url: '/images/avatar2.png' },
    { id: 3, name: 'Grogu', url: '/images/avatar3.png' },
    { id: 4, name: 'Stitch', url: '/images/avatar4.png' },
    { id: 5, name: 'Elsa', url: '/images/avatar5.png' },
    { id: 6, name: 'IronMan', url: '/images/avatar6.png' },
];

export default function ProfileSetupPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(disneyAvatars[0].url); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [currentProfileAvatar, setCurrentProfileAvatar] = useState(disneyAvatars[0].url);

    useEffect(() => {
        const fetchUserAndProfile = async () => {
            const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
            if (sessionError || !session) {
                router.push('/auth');
                return;
            }
            setUser(session.user);

           
            const { data: profileData, error: profileError } = await supabaseClient
                .from('profiles')
                .select('avatar_url')
                .eq('id', session.user.id)
                .single();

            if (profileData && profileData.avatar_url) {
                setCurrentProfileAvatar(profileData.avatar_url);
                setSelectedAvatar(profileData.avatar_url); 
            }
        };
        fetchUserAndProfile();
    }, [router]);

    const handleSetup = async (e) => {
        e.preventDefault();
        if (!username || !user) return;

        setLoading(true);
        setError(null);

        try {
            
            const { error: updateError } = await supabaseClient
                .from('profiles')
                .update({ 
                    username: username.trim(),
                    avatar_url: selectedAvatar 
                })
                .eq('id', user.id);
            
            if (updateError) {
                throw updateError;
            }


            router.push('/home');

        } catch (updateError) {
            console.error("Setup Error:", updateError);
            if (updateError.code === '23505') {
                 setError('This username is already taken. Please choose another one.');
            } else {
                 setError('An unexpected error occurred during setup. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div className="min-h-screen bg-[#040714] flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#040714] p-6 text-white">
            <div className="w-full max-w-3xl text-center">
                
                <h1 className="text-3xl font-bold mb-4">Welcome! Just one step left.</h1>
                <p className="text-gray-400 mb-8">
                    Choose a unique username and an avatar for your profile.
                </p>

                {error && (
                    <div className="bg-red-800 p-3 rounded mb-6 text-sm mx-auto max-w-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSetup}>
                    
                    
                    <div className="mb-10">
                        <h2 className="text-xl font-semibold mb-4">Choose your Avatar</h2>
                        <div className="flex justify-center flex-wrap gap-4">
                            {disneyAvatars.map((avatar) => (
                                <div
                                    key={avatar.id}
                                    className={`p-1 rounded-full cursor-pointer transition-all 
                                        ${selectedAvatar === avatar.url ? 'border-4 border-cyan-500 scale-110' : 'border-4 border-transparent opacity-70 hover:opacity-100'}`}
                                    onClick={() => setSelectedAvatar(avatar.url)}
                                >
                                    <Image 
                                        src={avatar.url} 
                                        alt={avatar.name} 
                                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-full" 
                                        width={96}
                                        height={96}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    
          
                    <div className="w-full max-w-sm mx-auto mb-6">
                        <label htmlFor="username" className="block text-left text-sm font-medium mb-2">Username</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Choose your unique username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full p-3 bg-gray-700 border-none rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            minLength={3}
                        />
                    </div>


                    <button
                        type="submit"
                        disabled={loading || !username}
                        className="bg-cyan-500 text-black font-bold py-3 px-10 rounded transition hover:bg-cyan-600 disabled:bg-gray-400 max-w-sm"
                    >
                        {loading ? 'Saving...' : 'Finish Setup'}
                    </button>
                </form>
            </div>
        </div>
    );
}