'use client';

import { useRef } from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { PersonalInfo } from '../types/sanity';

const fallbackInfo: Pick<PersonalInfo, 'email' | 'github' | 'twitter' | 'linkedin'> = {
    email: 'hello@example.com',
    github: '#',
    twitter: '#',
    linkedin: '#',
};

interface ContactSectionProps {
    info: PersonalInfo | null;
}

export default function ContactSection({ info }: ContactSectionProps) {
    const pageRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.to('.contact-text', {
            y: '0%',
            duration: 1.2,
            stagger: 0.1,
            ease: 'power4.out',
            scrollTrigger: { trigger: pageRef.current, start: 'top 80%' },
        });
        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, { scope: pageRef });

    const email = info?.email ?? fallbackInfo.email;
    const github = info?.github ?? fallbackInfo.github;
    const twitter = info?.twitter ?? fallbackInfo.twitter;
    const linkedin = info?.linkedin ?? fallbackInfo.linkedin;

    return (
        <div ref={pageRef}>
            <section className="py-24 md:py-40 px-6 md:px-16 lg:px-24 bg-[#0A192F] text-white min-h-screen flex flex-col justify-center">
                <div className="max-w-7xl mx-auto w-full">
                    <h2 className="text-sm uppercase tracking-widest mb-12 md:mb-24 opacity-60 font-medium">04 // Get in Touch</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
                        <div>
                            <h3 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-medium tracking-tighter leading-[0.85] mb-10 md:mb-16">
                                <div className="overflow-hidden"><div className="contact-text translate-y-full">Let&apos;s create</div></div>
                                <div className="overflow-hidden"><div className="contact-text translate-y-full">something</div></div>
                                <div className="overflow-hidden"><div className="contact-text translate-y-full">together.</div></div>
                            </h3>
                            <div className="overflow-hidden">
                                <a
                                    href={`mailto:${email}`}
                                    className="contact-text translate-y-full text-xl sm:text-2xl md:text-4xl lg:text-5xl font-light hover:italic transition-all border-b border-white/30 pb-3 md:pb-4 inline-block break-all"
                                >
                                    {email}
                                </a>
                            </div>
                        </div>
                        <div className="flex flex-col justify-end gap-10 md:gap-16 lg:pb-8">
                            <div className="flex gap-8 md:gap-12 overflow-hidden py-4">
                                {github && (
                                    <a href={github} className="contact-text translate-y-full hover:opacity-70 hover:-translate-y-2 transition-all duration-300" aria-label="GitHub">
                                        <Github size={40} strokeWidth={1.5} />
                                    </a>
                                )}
                                {twitter && (
                                    <a href={twitter} className="contact-text translate-y-full hover:opacity-70 hover:-translate-y-2 transition-all duration-300" aria-label="Twitter">
                                        <Twitter size={40} strokeWidth={1.5} />
                                    </a>
                                )}
                                {linkedin && (
                                    <a href={linkedin} className="contact-text translate-y-full hover:opacity-70 hover:-translate-y-2 transition-all duration-300" aria-label="LinkedIn">
                                        <Linkedin size={40} strokeWidth={1.5} />
                                    </a>
                                )}
                                <a href={`mailto:${email}`} className="contact-text translate-y-full hover:opacity-70 hover:-translate-y-2 transition-all duration-300" aria-label="Email">
                                    <Mail size={40} strokeWidth={1.5} />
                                </a>
                            </div>
                            <div className="overflow-hidden">
                                <p className="contact-text translate-y-full text-lg opacity-60 font-light">
                                    © {new Date().getFullYear()} Portfolio. All rights reserved.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
