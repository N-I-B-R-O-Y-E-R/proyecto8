'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabase.client';
import ContentList from './components/ContentList';
import { Search, ChevronDown, Moon, Play, Info } from 'lucide-react';


const COLOR_CONFIG = {
    dark: {
        background: 'bg-[#090E20]',       
        text: 'text-white',
        header: 'bg-[#12162C]',                
        card: 'bg-[#12162C]',                 
        input: 'bg-gray-700/70',               
        hero_base: '#090E20',
        ai_accent: 'bg-gray-800/70'
    },
    light: {
        background: 'bg-[#F5F7F9]',           
        text: 'text-gray-900',
        header: 'bg-white',                    
        card: 'bg-white',                  
        input: 'bg-white',                      
        hero_base: '#F5F7F9',
        ai_accent: 'bg-white'
    }
};

const ALL_GENRES = ['Marvel', 'StarWars', 'Pixar', 'Disney', 'National Geographic', 'Others'];
const BRAND_LOGOS = ['Disney', 'Pixar', 'Marvel', 'StarWars', 'National Geographic'];

const HERO_CONTENT_ITEMS = [
    {
        title: "Cruella",
        description: "Una joven y creativa Estella se convierte en la villana de moda, Cruella de Vil, mientras lidia con un conflicto emocional con su madrastra y la baronesa Von Hellman.",
        id: "cruella",
        background_url: "/images/card_cruella.jpg"
    },
    {
        title: "Encanto",
        description: "En una casa mágica en Colombia, la familia Madrigal vive sin la abuela, pero la magia se desvanece lentamente. Mirabel, la única sin poderes, podría ser la última esperanza para restaurarla.",
        id: "encanto",
        background_url: "/images/card_encanto.jpg"
    },
    {
        title: "Black Panther: Wakanda Forever",
        description: "La reina Ramonda, Shuri, M'Baku, Okoye y las Dora Milaje luchan por proteger su nación de las potencias mundiales tras la muerte del rey T'Challa.",
        id: "black_panther",
        background_url: "/images/card_bp.jpg"
    },
    {
        title: "Loki",
        description: "El Dios de las Mentiras es capturado por la Autoridad de Variación Temporal (AVT) después de robar el Tesseract, y se ve obligado a ayudar a cazar una variante peligrosa.",
        id: "loki",
        background_url: "/images/card_loki.jpg"
    }
];

const HeroCarousel = ({ item, router, isDarkMode }) => {
    const colorMode = isDarkMode ? COLOR_CONFIG.dark : COLOR_CONFIG.light;
    const heroBaseColor = colorMode.hero_base; 

    return (
        <div 
            key={item.id} 
            className="relative w-full h-[400px] md:h-[600px] bg-cover bg-center transition-opacity duration-1000"
            style={{ backgroundImage: `url(${item.background_url})` }}
        >
            <div 
                className="absolute inset-0 z-10"
                style={{
                    background: `
                        linear-gradient(to top, ${heroBaseColor} 0%, transparent 20%, transparent 80%, ${heroBaseColor} 100%),
                        linear-gradient(to right, ${heroBaseColor} 0%, transparent 10%, transparent 90%, ${heroBaseColor} 100%)
                    `,
                }}
            ></div>
            
         
            <div className="absolute inset-0 bg-gradient-to-t from-[#040714] via-transparent to-transparent z-10"></div>
            
            <div className="absolute bottom-0 left-0 p-6 md:p-12 lg:p-16 w-full md:w-2/3 lg:w-1/2 text-white z-20">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">{item.title}</h1>
                <p className="text-sm md:text-base text-gray-200 mb-8 drop-shadow-md line-clamp-3">
                    {item.description}
                </p>
                <div className="flex space-x-4">
                    <button
                        onClick={() => router.push(`/details/${item.id}`)}
                        className="flex items-center px-6 py-3 bg-white text-gray-900 font-bold rounded-lg shadow-xl 
                                         transition-transform transform hover:scale-105 hover:bg-gray-200"
                    >
                        <Play className="w-5 h-5 mr-2 fill-current" />
                        VER AHORA
                    </button>
                    <button
                        onClick={() => router.push(`/details/${item.id}`)}
                        className="flex items-center px-6 py-3 bg-gray-600/70 text-white font-bold rounded-lg shadow-xl border border-white/50
                                         transition-transform transform hover:scale-105 hover:bg-gray-700/80"
                    >
                        <Info className="w-5 h-5 mr-2" />
                        DETALLES
                    </button>
                </div>
            </div>
        </div>
    );
};


const SearchAndFilter = ({ searchTerm, setSearchTerm, selectedGenre, setSelectedGenre, isDarkMode }) => {
    const [isSearching, setIsSearching] = useState(false);
    
    const colorMode = isDarkMode ? COLOR_CONFIG.dark : COLOR_CONFIG.light;

    const inputClasses = isDarkMode
        ? `w-full p-2 ${colorMode.input} text-white text-sm rounded-lg border border-gray-600 focus:outline-none focus:ring-1 focus:ring-white placeholder-gray-400`
        : `w-full p-2 ${colorMode.input} text-gray-900 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-600 placeholder-gray-500`; 

    const iconClasses = isDarkMode ? "text-white hover:text-cyan-400" : "text-gray-700 hover:text-cyan-600";

    return (
        <div className="flex items-center space-x-2 relative">
            <div className={`transition-all duration-300 ${isSearching ? 'w-48 opacity-100' : 'w-6 opacity-0 md:opacity-100 md:w-32'}`}>
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={inputClasses}
                />
            </div>

         
            <button 
                className={`md:hidden p-2 ${iconClasses}`}
                onClick={() => setIsSearching(!isSearching)}
            >
                <Search className="w-6 h-6" />
            </button>


            <div className="hidden md:flex items-center relative">
                <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className={`${inputClasses} appearance-none cursor-pointer pr-8`} 
                >
                    <option value="">Género (Todos)</option>
                    {ALL_GENRES.map(genre => (
                        <option key={genre} value={genre} className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
                            {genre}
                        </option>
                    ))}
                </select>
                <ChevronDown className={`w-4 h-4 absolute right-2 pointer-events-none ${iconClasses}`} />
            </div>
            
        </div>
    );
};

const BrandRow = ({ setSelectedGenre, isDarkMode }) => {
    const colorMode = isDarkMode ? COLOR_CONFIG.dark : COLOR_CONFIG.light;
    
    const brandContainerClasses = isDarkMode 
        ? `${colorMode.card} border-transparent hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]`
        : `bg-white border-gray-200 border-opacity-50 hover:border-blue-300 hover:shadow-[0_0_15px_rgba(100,150,255,0.3)]`; 

    const textClasses = isDarkMode ? "text-white opacity-95" : "text-gray-800 opacity-95";

    return (
        <div className="flex justify-center md:justify-start space-x-4 mb-12 px-6 md:px-8 overflow-x-auto pb-4">
            {BRAND_LOGOS.map(brand => (
                <div 
                    key={brand}
                    className={`flex-shrink-0 p-3 rounded-xl shadow-lg border-2 
                                     transition-all duration-300 cursor-pointer 
                                     w-36 md:w-52 h-24 md:h-32 flex items-center justify-center transform hover:scale-[1.05]
                                     ${brandContainerClasses}`}
                    onClick={() => setSelectedGenre(brand)} 
                >
                    <p className={`text-3xl font-extrabold uppercase ${textClasses} ${brand === 'National Geographic' ? 'text-sm' : ''}`}>
                        {brand === 'National Geographic' ? 'NATIONAL GEOGRAPHIC' : brand}
                    </p>
                </div>
            ))}
        </div>
    );
};


export default function HomePage() {
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [content, setContent] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(true); 
    
    const colorMode = isDarkMode ? COLOR_CONFIG.dark : COLOR_CONFIG.light;

    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentHeroIndex(prevIndex => 
                (prevIndex + 1) % HERO_CONTENT_ITEMS.length
            );
        }, 5000); 

        return () => clearInterval(interval);
    }, []);

    const currentFeaturedContent = HERO_CONTENT_ITEMS[currentHeroIndex];

    
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (typeof window !== 'undefined' && window.scrollY > 100) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);


    const renderContentList = useCallback((genre, items) => (
        <ContentList 
            key={genre}
            title={`Recomendado en ${genre}`}
            contentItems={items}
            posterSizeClasses="w-64 h-[34rem] md:w-96 md:h-[40rem]" 
            titleClasses={colorMode.text.replace('text-', 'text-3xl font-bold text-')}
        />
    ), [colorMode.text]); 

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } = {} } = await supabaseClient.auth.getUser();
            if (!user) { router.replace('/auth'); return; }

            const { data: profileData } = await supabaseClient
                .from('profiles')
                .select('username, avatar_url')
                .eq('id', user.id)
                .single();
            
            if (profileData && !profileData.username) { router.replace('/profile-setup'); return; }
            setProfile(profileData);

            const { data: contentData } = await supabaseClient
                .from('content')
                .select('*')
                .order('release_year', { ascending: false }); 

            setContent(contentData || []);
            setLoading(false);
        };

        fetchData();
    }, [router]);


    const filteredContent = useMemo(() => {
        let items = content;
        if (selectedGenre) { items = items.filter(item => item.genre === selectedGenre); }
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            items = items.filter(item => 
                item.title.toLowerCase().includes(lowerCaseSearch) ||
                (item.description && item.description.toLowerCase().includes(lowerCaseSearch))
            );
        }
        return items;
    }, [content, selectedGenre, searchTerm]);

    const groupedContent = useMemo(() => {
        return filteredContent.reduce((acc, item) => {
            const genre = item.genre || 'Others';
            if (!acc[genre]) { acc[genre] = []; }
            acc[genre].push(item);
            return acc;
        }, {});
    }, [filteredContent]);

    const aiRecommendation = useMemo(() => {
        if (!searchTerm || content.length === 0) return null;
        
        const excludedIds = filteredContent.map(item => item.id);
        
        const potentialSuggestions = content
            .filter(item => !excludedIds.includes(item.id))
            .sort(() => 0.5 - Math.random()) 
            .slice(0, 3); 

        if (potentialSuggestions.length === 0) return null;

        const searchTitle = searchTerm.toLowerCase();
        let suggestionsText = '';
        if (searchTitle.includes("marvel") || searchTitle.includes("avengers")) {
            suggestionsText = "Basado en tu interés en Marvel, te recomiendo explorar 'WandaVision', 'Falcon y el Soldado de Invierno', y 'Ms. Marvel' para conocer las nuevas fases del UCM.";
        } else if (searchTitle.includes("star wars") || searchTitle.includes("mandalorian")) {
             suggestionsText = "Si te gusta Star Wars, el asistente sugiere: 'Andor' (un thriller político), 'Ahsoka' (viaje galáctico), y 'The Bad Batch' (animación de élite).";
        } else {
            const suggestedTitles = potentialSuggestions.map(item => item.title).join(', ');
            suggestionsText = `Hemos encontrado estos resultados. Además, basado en tu perfil, el Asistente de IA te sugiere: ${suggestedTitles} como contenido relevante.`;
        }

        return {
            recommendationText: suggestionsText,
            suggestions: potentialSuggestions
        };

    }, [searchTerm, content, filteredContent]); 

    
    const handleLogout = async () => {
        setLoading(true);
        await supabaseClient.auth.signOut();
        router.replace('/auth'); 
    };

    if (loading) {
        return <div className="min-h-screen bg-[#040714] flex items-center justify-center text-white text-xl">Cargando Disney+ Home...</div>;
    }

    
    const mainBgClass = colorMode.background;
    const textColorClass = colorMode.text;
    
    const headerBgClass = isScrolled 
        ? `${colorMode.header} shadow-xl` 
        : 'bg-transparent'; 

    const aiCardClasses = isDarkMode 
        ? `p-4 md:p-6 ${colorMode.ai_accent} rounded-xl mb-12 shadow-lg`
        : `p-4 md:p-6 ${colorMode.ai_accent} rounded-xl mb-12 shadow-md border border-gray-100`; 

    const aiTextClasses = isDarkMode ? "text-white" : "text-gray-800";
    
    const logoSrc = isDarkMode ? "/images/disney_logo.png" : "/images/disney_logo_dark.png";


    return (
        <div className={`min-h-screen ${mainBgClass} ${textColorClass}`}>
            <header className={`fixed top-0 left-0 w-full z-40 flex justify-between items-center p-4 md:p-6 lg:p-8 
                                     transition-all duration-300 ease-in-out
                                     ${headerBgClass}`}
            >
                
                <Image 
                    src={logoSrc} 
                    alt={"Disney+ Logo"} 
                    className="h-12 md:h-16" 
                    width={120}
                    height={64}
                    priority
                    style={{ width: 'auto', height: 'auto' }}
                />
                
                <div className="flex items-center space-x-6">
                    <SearchAndFilter 
                        searchTerm={searchTerm} 
                        setSearchTerm={setSearchTerm} 
                        selectedGenre={selectedGenre}
                        setSelectedGenre={setSelectedGenre}
                        isDarkMode={isDarkMode} 
                    />

                    <button 
                        onClick={() => setIsDarkMode(prev => !prev)}
                        className={`p-2 rounded-full ${textColorClass} hover:opacity-70 transition hidden md:block`}
                        title="Alternar Modo Claro/Oscuro"
                    >
                        <Moon className="w-6 h-6" />
                    </button>
                    
                    {profile && (
                        <div className="flex items-center space-x-2 group cursor-pointer relative">
                            <Image 
                                src={profile.avatar_url} 
                                alt={`${profile.username}&apos;s avatar`} 
                                className={`w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border transition ${isDarkMode ? 'border-cyan-500 hover:border-white' : 'border-cyan-600 hover:border-gray-900'}`}
                                width={48}
                                height={48}
                            />
                            
                            <div className="absolute top-12 right-0 hidden group-hover:block bg-gray-800 p-2 rounded shadow-lg whitespace-nowrap z-50">
                                <button onClick={handleLogout} className="text-xs text-white hover:text-cyan-400">
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <main className="pb-10">
                
                {!(searchTerm || selectedGenre) && <HeroCarousel item={currentFeaturedContent} router={router} isDarkMode={isDarkMode} />}
                {!(searchTerm || selectedGenre) && <BrandRow setSelectedGenre={setSelectedGenre} isDarkMode={isDarkMode} />}


                <div className="space-y-10 px-6 md:px-8 pt-20 md:pt-0">
                    
                    {(searchTerm || selectedGenre) ? (
                        <>
                            <h2 className={`text-4xl md:text-5xl font-extrabold mb-8 pt-4 ${textColorClass}`}>
                                Resultados para &quot;{searchTerm || selectedGenre}&quot;
                            </h2>

                            {aiRecommendation && (
                                <div className={aiCardClasses}>
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-4 h-4 rounded-full bg-cyan-600 flex items-center justify-center">
                                            <span className="text-xs font-bold text-white leading-none">A</span>
                                        </div>
                                        <p className={`text-sm font-semibold ${isDarkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>Asistente de IA sugiere:</p>
                                    </div>
                                    <p className={`text-lg leading-relaxed ${aiTextClasses}`}>
                                        {aiRecommendation.recommendationText}
                                    </p>
                                </div>
                            )}

                            <ContentList 
                                title="Películas y Series Encontradas"
                                contentItems={filteredContent}
                                posterSizeClasses="w-64 h-[34rem] md:w-96 md:h-[40rem]" 
                                titleClasses={colorMode.text.replace('text-', 'text-3xl font-bold text-')}
                            />

                            {aiRecommendation?.suggestions?.length > 0 && (
                                <ContentList 
                                    title="Te podría interesar"
                                    contentItems={aiRecommendation.suggestions}
                                    posterSizeClasses="w-64 h-[34rem] md:w-96 md:h-[40rem]" 
                                    titleClasses={isDarkMode ? 'text-2xl md:text-3xl font-bold text-gray-300' : 'text-2xl md:text-3xl font-bold text-gray-600'}
                                />
                            )}
                        </>
                    ) : (
                        <>
                            {Object.keys(groupedContent).map((genre) => (
                                renderContentList(genre, groupedContent[genre])
                            ))}
                        </>
                    )}
                    
                    {Object.keys(groupedContent).length === 0 && (
                        <p className={`${textColorClass} opacity-50 text-center mt-20`}>No se encontró contenido que coincida con tus criterios.</p>
                    )}
                </div>
            </main>
        </div>
    );
}