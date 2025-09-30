'use client';

import { ArrowLeft, Play, Plus, XCircle, Info } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';



const CONTENT_DETAILS_MOCK = {
    "cruella": {
        title: "Cruella",
        full_synopsis: "Estella, una joven ambiciosa y con un talento innato para el diseño, llega a Londres con la esperanza de hacerse un nombre en el mundo de la moda. Después de un giro del destino, su camino la lleva a trabajar para la legendaria Baronesa Von Hellman. Sin embargo, su conexión con la Baronesa la empuja al lado oscuro, donde Estella abraza su alter ego rebelde: la brillante, excéntrica y despiadada Cruella.",
        trailer_url: "https://www.youtube.com/embed/gmRKv7n2If8?autoplay=1&mute=0&controls=0",
        genre: "Disney",
        runtime: "2h 14m",
        rating: "PG-13",
        release_year: 2021,
        poster_url: "/images/card_cruella.jpg",
        background_url: "/images/banner_cruella.jpg"
    },
    "encanto": {
        title: "Encanto",
        full_synopsis: "La familia Madrigal vive escondida en las montañas de Colombia, en una casa mágica, en un pueblo vibrante, en un lugar maravilloso y encantador llamado Encanto. La magia del Encanto ha bendecido a cada niño de la familia con un don único, desde la superfuerza hasta el poder de sanar. A excepción de Mirabel. Cuando descubre que la magia que rodea a Encanto está en peligro, Mirabel, la única Madrigal ordinaria, decide que ella podría ser la última esperanza de su excepcional familia.",
        trailer_url: "https://www.youtube.com/embed/sHu7zHSMyRs?autoplay=1&mute=0&controls=0",
        genre: "Pixar",
        runtime: "1h 42m",
        rating: "PG",
        release_year: 2021,
        poster_url: "/images/card_encanto.jpg",
        background_url: "https://placehold.co/1200x675/040714/FFFFFF?text=ENCANTO+BG"
    },
    "black_panther": {
        title: "Black Panther: Wakanda Forever",
        full_synopsis: "La nación de Wakanda llora la pérdida de su rey T'Challa y se enfrenta a la intervención de las potencias mundiales. La Reina Ramonda, Shuri, M'Baku, Okoye y las Dora Milaje deben unirse para proteger a su reino de una nueva amenaza submarina, la nación oculta de Talokan, liderada por Namor. La búsqueda de un nuevo Black Panther llevará a la nación a la nación a un camino de dolor y redención.",
        trailer_url: "https://www.youtube.com/embed/_Z3QKkl1WyM?autoplay=1&mute=0&controls=0",
        genre: "Marvel",
        runtime: "2h 41m",
        rating: "PG-13",
        release_year: 2022,
        poster_url: "/images/card_bp.jpg",
        background_url: "https://placehold.co/1200x675/040714/FFFFFF?text=BP+BG"
    },
    "loki": {
        title: "Loki",
        full_synopsis: "Después de robar el Tesseract durante los eventos de Avengers: Endgame, una versión alternativa de Loki es capturada por la misteriosa Autoridad de Variación Temporal (AVT), una organización que existe fuera del tiempo y el espacio. Loki es obligado a ayudar a cazar una peligrosa variante de sí mismo, siendo testigo de la fragilidad del tiempo y su propio destino. Debe decidir entre el camino de la destrucción o la redención.",
        trailer_url: "https://www.youtube.com/embed/dug56u8NN7g?autoplay=1&mute=0&controls=0",
        genre: "Marvel",
        runtime: "Serie de TV",
        rating: "TV-14",
        release_year: 2021,
        poster_url: "/images/card_loki.jpg",
        background_url: "https://placehold.co/1200x675/040714/FFFFFF?text=LOKI+BG"
    }
};



const ActionButton = ({ icon: Icon, text, onClick, primary = false }) => (
    <button
        onClick={onClick}
        className={`flex items-center px-6 py-2.5 font-bold rounded-lg shadow-xl transition-all transform hover:scale-[1.03] text-sm md:text-base
 ${primary
                ? 'bg-white text-gray-900 hover:bg-gray-200 min-w-[150px] justify-center'
                : 'bg-gray-600/70 text-white border border-white/50 hover:bg-gray-700/80 min-w-[150px] justify-center'
            }`}
    >
        <Icon className="w-5 h-5 mr-2 fill-current" />
        {text}
    </button>
);

const NotFoundMessage = ({ contentId, bgColor, textColor, router }) => (
    <div className={`min-h-screen ${bgColor} ${textColor} flex flex-col items-center justify-center p-8 text-center`}>
        <XCircle className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold mb-4">Contenido No Encontrado</h1>
        <p className="text-lg mb-8">El ID de contenido **&quot;{contentId || 'vacío'}&quot;** no existe.</p>
        <ActionButton icon={ArrowLeft} text="Volver al Inicio" onClick={() => router.push('/')} primary={true} />
    </div>
);



export default function DetailsPage() {
    const router = useRouter();
    const params = useParams();

    const contentId = params?.id;
    const content = CONTENT_DETAILS_MOCK[contentId];

    const bgColor = 'bg-[#040714]';
    const textColor = 'text-white';
    const accentColor = 'text-cyan-400';

    if (!content) {
        return <NotFoundMessage contentId={contentId} bgColor={bgColor} textColor={textColor} router={router} />;
    }

    return (
        <div className={`min-h-screen ${bgColor} ${textColor}`}>

            <button
                onClick={() => router.back()}
                className="fixed top-6 left-6 z-50 p-3 rounded-full bg-gray-800/80 hover:bg-gray-700 transition"
                title="Volver a la página anterior"
            >
                <ArrowLeft className="w-6 h-6 text-white" />
            </button>

            <div className="relative w-full h-[65vh] md:h-[90vh] overflow-hidden">
                <div className="absolute inset-0 z-10">
                    <iframe
                        className="w-full h-full"
                        src={content.trailer_url}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={`Tráiler de ${content.title}`}
                    ></iframe>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#040714] via-[#040714]/40 to-transparent z-20"></div>

                <div className="absolute bottom-0 left-0 p-6 md:p-12 lg:p-16 w-full text-white z-30 flex flex-col justify-end">

                    <h1 className="text-5xl md:text-8xl font-black drop-shadow-lg leading-tight mb-2">
                        {content.title}
                    </h1>

                    <div className="flex items-center space-x-4 text-gray-300 text-sm md:text-base font-semibold mb-8">
                        <span>{content.release_year}</span>
                        <span className="text-lg">·</span>
                        <span>{content.runtime}</span>
                        <span className="text-lg">·</span>
                        <span className="border border-gray-400 px-2 py-0.5 rounded text-xs font-bold">{content.rating}</span>
                        <span className="text-lg">·</span>
                        <span className={`${accentColor} uppercase text-xs font-extrabold tracking-widest`}>{content.genre}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <ActionButton
                            icon={Play}
                            text="REPRODUCIR"
                            onClick={() => console.log(`Iniciando reproducción de ${content.title}`)}
                            primary={true}
                        />
                        <ActionButton
                            icon={Plus}
                            text="MI LISTA"
                            onClick={() => console.log(`Añadido ${content.title} a la lista`)}
                        />
                    </div>
                </div>
            </div>

            ---

            <main className="max-w-6xl mx-auto p-6 md:p-12 -mt-16 relative z-30 pb-20">
                <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-12">

                    <div className="md:w-3/4">
                        <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2 flex items-center">
                            <Info className='w-6 h-6 mr-2 text-cyan-400' /> Detalles de la Historia
                        </h2>
                        <p className="text-lg leading-relaxed text-gray-300">
                            {content.full_synopsis}
                        </p>
                    </div>

                    <div className="md:w-1/4">
                        <div className="bg-gray-800/80 p-6 rounded-xl shadow-2xl border border-gray-700">
                            <h3 className="text-xl font-extrabold mb-4 text-cyan-400">Datos Clave</h3>

                            <Image
                                src={content.poster_url}
                                alt={`Poster de ${content.title}`}
                                className="w-full h-auto rounded-lg mb-4 object-cover shadow-xl"
                                width={300}
                                height={450}
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x450/040714/FFFFFF?text=POSTER'; }}
                            />

                            <div className='space-y-2 text-gray-200'>
                                <p className="text-sm"><span className="font-semibold text-gray-400">Género:</span> {content.genre}</p>
                                <p className="text-sm"><span className="font-semibold text-gray-400">Año de Lanzamiento:</span> {content.release_year}</p>
                                <p className="text-sm"><span className="font-semibold text-gray-400">Duración Total:</span> {content.runtime}</p>
                                <p className="text-sm pt-2 border-t border-gray-700 mt-2"><span className="font-semibold text-gray-400">Director:</span> Mock Director</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}