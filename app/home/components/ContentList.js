"use client";
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ContentList({ title, contentItems }) {
    const listRef = useRef(null); 

    if (!contentItems || contentItems.length === 0) {
        return null;
    }

    const scrollList = (direction) => {
        if (listRef.current) {
            const scrollAmount = listRef.current.clientWidth * 0.8; 
            listRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="mb-10 relative group">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
                {title}
            </h2>
            <div 
                ref={listRef}
                className="flex overflow-x-scroll space-x-4 pb-4 custom-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
            >
                {contentItems.map((item) => (
                    <Link href={`/details/${item.id}`} key={item.id}>
                        <div 
                            className="flex-shrink-0 w-40 md:w-56 h-auto cursor-pointer rounded-lg shadow-xl 
                                transition-all duration-300 transform 
                                hover:scale-[1.07] hover:border-4 hover:border-gray-100 hover:shadow-cyan-500/30"
                        >
                            <Image
                                src={item.card_image_url || item.poster_url}
                                alt={item.title}
                                className="w-full h-full object-cover rounded-lg"
                                width={320}
                                height={180}
                                style={{ aspectRatio: '16/9' }}
                                priority
                            />
                        </div>
                    </Link>
                ))}
            </div>
            <button
                onClick={() => scrollList('left')}
                className="absolute left-0 top-1/2 -mt-10 md:-mt-12 w-10 h-20 bg-black/70 text-white z-50 
                           flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={() => scrollList('right')}
                className="absolute right-0 top-1/2 -mt-10 md:-mt-12 w-10 h-20 bg-black/70 text-white z-50 
                           flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>
    );
}