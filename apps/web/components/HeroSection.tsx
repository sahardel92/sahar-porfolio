'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { PersonalInfo } from '../types/sanity';

const fallbackInfo: Pick<PersonalInfo, 'tagline' | 'bio'> = {
    tagline: 'Creative Developer.',
    bio: 'I craft minimal, engaging, and performant digital experiences with a focus on typography and motion.',
};

interface HeroSectionProps {
    info: PersonalInfo | null;
}

export default function HeroSection({ info }: HeroSectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline();
        tl.to('.hero-text', { y: '0%', duration: 1.4, stagger: 0.15, ease: 'power4.out', delay: 0.3 })
            .to('.hero-subtext', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '-=0.9');
    }, { scope: sectionRef });

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 40;
        const yPos = (clientY / window.innerHeight - 0.5) * 40;

        gsap.to('.hero-layer-1', { x: xPos, y: yPos, duration: 1, ease: 'power2.out', overwrite: 'auto' });
        gsap.to('.hero-layer-2', { x: xPos * 1.5, y: yPos * 1.5, duration: 1.2, ease: 'power2.out', overwrite: 'auto' });
    }

    function handleMouseLeave() {
        gsap.to(['.hero-layer-1', '.hero-layer-2'], { x: 0, y: 0, duration: 1, ease: 'power3.out', overwrite: 'auto' });
    }

    const tagline = info?.tagline ?? fallbackInfo.tagline;
    const bio = info?.bio ?? fallbackInfo.bio;
    const [taglineFirst, ...taglineRest] = tagline!.split(' ');
    const taglineSuffix = taglineRest.join(' ');

    return (
        <div ref={sectionRef}>
            <section
                className="min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-28 md:pt-32 pb-16 md:pb-24 overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <div className="hero-content max-w-6xl relative z-10 w-full cursor-default">
                    <h1 className="hero-layer-1 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tighter leading-[0.88] mb-8 md:mb-12 will-change-transform">
                        <div className="overflow-hidden py-2">
                            <div className="hero-text translate-y-full">{taglineFirst}</div>
                        </div>
                        {taglineSuffix && (
                            <div className="overflow-hidden py-2">
                                <div className="hero-text translate-y-full text-neutral-400">{taglineSuffix}</div>
                            </div>
                        )}
                    </h1>
                    <p className="hero-layer-2 hero-subtext opacity-0 translate-y-8 text-lg sm:text-xl md:text-2xl font-light max-w-2xl leading-relaxed text-neutral-600 will-change-transform">
                        {bio}
                    </p>
                </div>
            </section>
        </div>
    );
}
