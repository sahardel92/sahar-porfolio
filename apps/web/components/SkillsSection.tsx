'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Skill } from '../types/sanity';

const fallbackSkills1 = ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GSAP', 'Node.js', 'Figma', 'UI/UX Design', 'React', 'TypeScript', 'Next.js'];
const fallbackSkills2 = ['Creative Coding', 'Web Design', 'Three.js', 'Framer Motion', 'Vite', 'GraphQL', 'Supabase', 'Vercel', 'Creative Coding', 'Web Design'];

interface SkillsSectionProps {
    skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
    const pageRef = useRef<HTMLDivElement>(null);

    const row1 = skills.filter((s) => s.row === 1).map((s) => s.name);
    const row2 = skills.filter((s) => s.row === 2).map((s) => s.name);

    const skills1 = row1.length > 0 ? row1 : fallbackSkills1;
    const skills2 = row2.length > 0 ? row2 : fallbackSkills2;

    // Duplicate rows for seamless infinite feel
    const displaySkills1 = [...skills1, ...skills1];
    const displaySkills2 = [...skills2, ...skills2];

    useGSAP(() => {
        gsap.to('.skills-row-1', {
            xPercent: -15,
            ease: 'none',
            scrollTrigger: { trigger: pageRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
        gsap.to('.skills-row-2', {
            xPercent: 15,
            ease: 'none',
            scrollTrigger: { trigger: pageRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, { scope: pageRef, dependencies: [skills1, skills2] });

    return (
        <div ref={pageRef}>
            <section className="py-24 md:py-40 bg-[#0A192F] text-white overflow-hidden min-h-screen flex flex-col justify-center">
                <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 mb-16 md:mb-24">
                    <h2 className="text-sm uppercase tracking-widest opacity-60 font-medium">01 // Skills</h2>
                </div>

                <div className="flex flex-col gap-6 md:gap-12">
                    <div className="skills-row-1 flex whitespace-nowrap gap-6 md:gap-16 w-max">
                        {displaySkills1.map((skill, i) => (
                            <span
                                key={`r1-${i}`}
                                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-light tracking-tight hover:italic transition-all cursor-default"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                    <div className="skills-row-2 flex whitespace-nowrap gap-6 md:gap-16 w-max -translate-x-[30%]">
                        {displaySkills2.map((skill, i) => (
                            <span
                                key={`r2-${i}`}
                                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-light tracking-tight hover:italic transition-all cursor-default text-white/50"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
