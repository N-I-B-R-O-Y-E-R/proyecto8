'use client'; 
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function LogoRow() {
    const singleLogoRowUrl = "/images/logos.png"; 

    return (
        <div className="mt-8 flex justify-center md:justify-start"> 
            <Image 
                src={singleLogoRowUrl} 
                alt={"Disney+ Brands Row"} 
                width={400}
                height={80}
                priority
                style={{ width: 'auto', height: 'auto' }}
            />
        </div>
    );
}

export default function WelcomePage() {
    const router = useRouter(); 
    const [email, setEmail] = useState('');
    
    const backgrounds = [
        '/images/background_1.jpg', '/images/background_2.jpg', '/images/background_3.jpg',
        '/images/background_4.jpg', '/images/background_5.jpg',
    ];
    const [currentBgIndex, setCurrentBgIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBgIndex(prevIndex => (prevIndex + 1) % backgrounds.length);
        }, 5000); 
        return () => clearInterval(interval);
    }, [backgrounds.length]);

    const handleSignUp = () => {
        const query = email ? `?email=${encodeURIComponent(email)}` : '';
        router.push(`/auth${query}`); 
    };

    return (
        <div className="min-h-screen bg-[#040714] relative overflow-hidden">
            
            <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
                {backgrounds.map((url, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out`}
                        style={{
                            backgroundImage: `url('${url}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: index === currentBgIndex ? 1 : 0,
                            zIndex: index === currentBgIndex ? 1 : 0
                        }}
                    />
                ))}
            </div>
            
            <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
            
            <header className="absolute top-0 w-full py-4 px-6 md:px-16 lg:px-20 flex justify-end items-center z-30"> 
                
                <Link 
                    href="/auth" 
                    className="bg-black/60 text-white text-sm font-bold py-2 px-4 rounded transition hover:bg-black/90 border border-white/30"
                >
                    LOG IN
                </Link>
            </header>

            <div className="relative z-20 flex items-center min-h-screen px-6 md:px-16 lg:px-20 pt-28"> 
                <div className="max-w-lg text-white text-center md:text-left w-full md:w-auto"> 
                    
                    <Image 
                        src="/images/disney_logo.png" 
                        alt={"Disney+ Logo"} 
                        width={128}
                        height={48}
                        priority
                    />
                    
                    <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-8">
                        Exclusive shows, box office hits, sports from ESPN, and more
                    </h1>
                    
                    <p className="mb-4 text-gray-300">
                        Enter your email to get started
                    </p>

                    <div className="flex flex-col sm:flex-row w-full max-w-md mx-auto md:mx-0">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-grow p-4 bg-gray-700/80 border-none rounded-t-md sm:rounded-l-md sm:rounded-t-none text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <button
                            onClick={handleSignUp}
                            className="bg-cyan-500 text-black font-bold py-4 px-6 rounded-b-md sm:rounded-r-md sm:rounded-b-none flex items-center justify-center transition hover:bg-cyan-600"
                        >
                            SIGN UP NOW
                        </button>
                    </div>
                    
                    <p className="text-xs mt-3 text-gray-400">
                        Save 30% or more on Disney+ Premium Annual. <span className="underline cursor-pointer">View plan details.</span>
                    </p>

                    <LogoRow />
                </div>
            </div>
            <div className="absolute bottom-0 w-full z-30 pt-16 pb-6 px-6 md:px-16 lg:px-20"> 
            </div>
        </div>
    );
}