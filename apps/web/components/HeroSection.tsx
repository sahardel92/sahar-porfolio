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
        tl.to('.hero-text', { y: '0%', duration: 1.2, stagger: 0.15, ease: 'power4.out', delay: 0.2 })
            .to('.hero-subtext', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.8');
    }, { scope: sectionRef });

    const tagline = info?.tagline ?? fallbackInfo.tagline;
    const bio = info?.bio ?? fallbackInfo.bio;
    const [taglineFirst, ...taglineRest] = tagline!.split(' ');
    const taglineSuffix = taglineRest.join(' ');

    return (
        <div ref={sectionRef}>
            <section className="min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-28 md:pt-32 pb-16 md:pb-24">
                <div className="hero-content max-w-6xl">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-medium tracking-tighter leading-[0.88] mb-8 md:mb-12">
                        <div className="overflow-hidden">
                            <div className="hero-text translate-y-full">{taglineFirst}</div>
                        </div>
                        {taglineSuffix && (
                            <div className="overflow-hidden">
                                <div className="hero-text translate-y-full">{taglineSuffix}</div>
                            </div>
                        )}
                    </h1>
                    <p className="hero-subtext opacity-0 translate-y-8 text-lg sm:text-xl md:text-2xl lg:text-3xl font-light max-w-3xl leading-snug text-[#0A192F]/80">
                        {bio}
                    </p>
                </div>
            </section>
        </div>
    );
}
