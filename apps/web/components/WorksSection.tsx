'use client';

import { useRef, useState } from 'react';
import TransitionLink from './TransitionLink';
import { ArrowRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { urlFor } from '../lib/sanity';
import type { Work } from '../types/sanity';

const fallbackWorks: Work[] = [
    { _id: '1', title: 'E-Commerce Platform', category: 'Web Development', year: '2025', slug: { current: 'e-commerce-platform' }, tags: ['React', 'Next.js', 'Stripe'] },
    { _id: '2', title: 'Fintech Dashboard', category: 'UI/UX Design', year: '2024', slug: { current: 'fintech-dashboard' }, tags: ['Figma', 'TypeScript', 'D3.js'] },
    { _id: '3', title: 'AI Content Generator', category: 'Full Stack', year: '2024', slug: { current: 'ai-content-generator' }, tags: ['Node.js', 'OpenAI', 'React'] },
];

function WorkRow({ work, index }: { work: Work; index: number }) {
    const rowRef = useRef<HTMLAnchorElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
        const thumb = thumbRef.current;
        const row = rowRef.current;
        if (!thumb || !row) return;
        const rect = row.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        gsap.to(thumb, {
            x: x - 120,
            y: y - 90,
            duration: 0.4,
            ease: 'power2.out',
        });
    }

    function handleMouseEnter() {
        setIsHovered(true);
        gsap.to(thumbRef.current, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' });
    }

    function handleMouseLeave() {
        setIsHovered(false);
        gsap.to(thumbRef.current, { opacity: 0, scale: 0.88, duration: 0.3, ease: 'power3.in' });
    }

    return (
        <TransitionLink
            ref={rowRef}
            href={`/works/${work.slug.current}`}
            className="group relative py-8 md:py-14 flex flex-col md:flex-row md:items-center justify-between md:cursor-none px-4 md:px-8 -mx-4 md:-mx-8 overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Top border line */}
            <div className={`work-line absolute top-0 left-0 h-[1px] w-full transition-colors duration-300 ${isHovered ? 'bg-[#0A192F]/40' : 'bg-[#0A192F]/20'}`} />

            {/* Floating thumbnail */}
            <div
                ref={thumbRef}
                className="pointer-events-none absolute z-10 w-60 h-44 overflow-hidden opacity-0 scale-[0.88] hidden md:block"
                style={{ top: 0, left: 0 }}
            >
                {work.image ? (
                    <img
                        src={urlFor(work.image).width(480).height(352).fit('crop').url()}
                        alt={work.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-[#0A192F]/10 flex items-center justify-center">
                        <span className="text-xs uppercase tracking-widest opacity-30">{work.category}</span>
                    </div>
                )}
            </div>

            {/* Left — title + meta */}
            <div className="work-item-content flex flex-col gap-3 md:gap-4 relative z-0">
                <div className="flex items-center gap-3 md:gap-6">
                    <span className="text-sm font-mono opacity-30 w-6">{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-medium tracking-tighter group-hover:italic transition-all duration-300">
                        {work.title}
                    </h3>
                </div>
                <div className="flex items-center gap-3 md:gap-4 pl-9 md:pl-12 flex-wrap">
                    <span className="text-sm md:text-lg opacity-50 font-light">{work.category}</span>
                    {work.tags && work.tags.length > 0 && (
                        <>
                            <span className="opacity-20">·</span>
                            <div className="flex gap-2 flex-wrap">
                                {work.tags.slice(0, 3).map((tag) => (
                                    <span key={tag} className="text-xs uppercase tracking-wider border border-[#0A192F]/20 px-2 py-0.5 font-medium opacity-50">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Right — year + arrow */}
            <div className="work-item-content mt-4 md:mt-0 flex items-center gap-4 md:gap-8 shrink-0 relative z-0">
                <span className="text-lg md:text-2xl font-light opacity-40">{work.year}</span>
                <ArrowRight
                    size={28}
                    className="md:w-10 md:h-10 transform -rotate-45 group-hover:rotate-0 transition-transform duration-500"
                    strokeWidth={1}
                />
            </div>
        </TransitionLink>
    );
}

interface WorksSectionProps {
    works: Work[];
}

export default function WorksSection({ works }: WorksSectionProps) {
    const pageRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (works.length === 0 && fallbackWorks.length === 0) return;
        gsap.fromTo(
            '.work-line',
            { scaleX: 0 },
            { scaleX: 1, transformOrigin: 'left center', duration: 1.5, ease: 'power3.inOut', stagger: 0.1, scrollTrigger: { trigger: pageRef.current, start: 'top 75%' } }
        );
        gsap.fromTo(
            '.work-item-content',
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: pageRef.current, start: 'top 75%' } }
        );
        return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    }, { scope: pageRef, dependencies: [works] });

    const displayWorks = works.length > 0 ? works : fallbackWorks;

    return (
        <div ref={pageRef}>
            <section className="py-24 md:py-40 px-6 md:px-16 lg:px-24 bg-white min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-sm uppercase tracking-widest mb-12 md:mb-24 opacity-60 font-medium">02 // Selected Works</h2>
                    <div className="flex flex-col">
                        {displayWorks.map((work, index) => (
                            <WorkRow key={work._id || index} work={work} index={index} />
                        ))}
                        <div className="work-line h-[1px] bg-[#0A192F]/20 w-full" />
                    </div>
                </div>
            </section>
        </div>
    );
}
