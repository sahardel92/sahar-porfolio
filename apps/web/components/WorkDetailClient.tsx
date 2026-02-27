'use client';

import { useRef } from 'react';
import TransitionLink from './TransitionLink';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { PortableText } from '@portabletext/react';
import type { PortableTextComponents } from '@portabletext/react';
import { urlFor } from '../lib/sanity';
import type { Work } from '../types/sanity';

const portableTextComponents: PortableTextComponents = {
    block: {
        normal: ({ children }) => (
            <p className="text-xl font-light leading-relaxed opacity-80 mb-8">{children}</p>
        ),
        h2: ({ children }) => (
            <h2 className="text-4xl md:text-5xl font-medium tracking-tighter leading-tight mb-6 mt-16">{children}</h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-4 mt-12">{children}</h3>
        ),
        blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[#0A192F]/30 pl-8 my-12 text-2xl font-light italic opacity-70 leading-relaxed">
                {children}
            </blockquote>
        ),
    },
    marks: {
        strong: ({ children }) => <strong className="font-medium">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        code: ({ children }) => (
            <code className="font-mono text-sm bg-[#0A192F]/5 px-2 py-0.5 rounded">{children}</code>
        ),
        link: ({ value, children }) => (
            <a
                href={value?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:opacity-60 transition-opacity"
            >
                {children}
            </a>
        ),
    },
    types: {
        image: ({ value }) => (
            <figure className="my-16">
                <div className="overflow-hidden bg-[#0A192F]/5">
                    <img
                        src={urlFor(value).width(1400).url()}
                        alt={value.alt ?? ''}
                        className="w-full h-auto object-cover"
                    />
                </div>
                {value.caption && (
                    <figcaption className="text-sm opacity-40 font-mono mt-4 text-center">{value.caption}</figcaption>
                )}
            </figure>
        ),
    },
};

interface WorkDetailClientProps {
    work: Work;
}

export default function WorkDetailClient({ work }: WorkDetailClientProps) {
    const pageRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline();
        tl.fromTo('.wd-hero-img', { scale: 1.04 }, { scale: 1, duration: 1.4, ease: 'power3.out' })
            .fromTo('.wd-title', { y: '100%' }, { y: '0%', duration: 1, ease: 'power4.out', stagger: 0.1 }, '-=0.8')
            .fromTo('.wd-meta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.06, ease: 'power3.out' }, '-=0.6');
    }, { scope: pageRef, dependencies: [work] });

    return (
        <div ref={pageRef} className="bg-white text-[#0A192F]">
            {/* ── Hero image ─────────────────────────────────────── */}
            <div className="w-full overflow-hidden bg-[#0A192F]/5 pt-24" style={{ height: 'clamp(320px, 60vh, 700px)' }}>
                {work.image ? (
                    <img
                        src={urlFor(work.image).width(1800).height(900).fit('crop').url()}
                        alt={work.title}
                        className="wd-hero-img w-full h-full object-cover"
                    />
                ) : (
                    <div className="wd-hero-img w-full h-full bg-[#0A192F]/5" />
                )}
            </div>

            {/* ── Header block ───────────────────────────────────── */}
            <div className="px-8 md:px-24 pt-16 pb-24 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-[#0A192F]/10 pb-16 mb-16">
                    <div className="flex-1">
                        <div className="overflow-hidden mb-3">
                            <div className="wd-title text-xs uppercase tracking-widest opacity-40 font-medium">
                                {work.category} · {work.year}
                            </div>
                        </div>
                        <div className="overflow-hidden">
                            <h1 className="wd-title text-6xl md:text-8xl font-medium tracking-tighter leading-[0.85]">
                                {work.title}
                            </h1>
                        </div>
                    </div>

                    <div className="wd-meta flex gap-4 shrink-0 pb-2">
                        {work.liveUrl && (
                            <a
                                href={work.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm uppercase tracking-widest font-medium border border-[#0A192F] px-6 py-3 hover:bg-[#0A192F] hover:text-white transition-all duration-300"
                            >
                                <ExternalLink size={14} strokeWidth={1.5} /> Live
                            </a>
                        )}
                        {work.githubUrl && (
                            <a
                                href={work.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm uppercase tracking-widest font-medium border border-[#0A192F]/30 px-6 py-3 hover:border-[#0A192F] transition-all duration-300"
                            >
                                <Github size={14} strokeWidth={1.5} /> Code
                            </a>
                        )}
                    </div>
                </div>

                {/* ── Meta row ─────────────────────────────────────── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
                    <div className="wd-meta">
                        <p className="text-xs uppercase tracking-widest opacity-40 font-medium mb-2">Category</p>
                        <p className="text-lg font-light">{work.category}</p>
                    </div>
                    <div className="wd-meta">
                        <p className="text-xs uppercase tracking-widest opacity-40 font-medium mb-2">Year</p>
                        <p className="text-lg font-light">{work.year}</p>
                    </div>
                    {work.tags && work.tags.length > 0 && (
                        <div className="wd-meta col-span-2">
                            <p className="text-xs uppercase tracking-widest opacity-40 font-medium mb-3">Stack</p>
                            <div className="flex flex-wrap gap-2">
                                {work.tags.map((tag) => (
                                    <span key={tag} className="text-xs uppercase tracking-wider border border-[#0A192F]/20 px-3 py-1 font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Short description ────────────────────────────── */}
                {work.description && (
                    <div className="wd-meta max-w-3xl mb-24">
                        <p className="text-3xl md:text-4xl font-light leading-snug opacity-80">{work.description}</p>
                    </div>
                )}

                {/* ── Rich body ────────────────────────────────────── */}
                {work.body && work.body.length > 0 && (
                    <div className="max-w-3xl">
                        <PortableText
                            value={work.body as Parameters<typeof PortableText>[0]['value']}
                            components={portableTextComponents}
                        />
                    </div>
                )}

                {/* ── Gallery grid ─────────────────────────────────── */}
                {work.gallery && work.gallery.length > 0 && (
                    <div className="mt-24">
                        <p className="text-xs uppercase tracking-widest opacity-40 font-medium mb-12">Gallery</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {work.gallery.map((img, i) => (
                                <div
                                    key={i}
                                    className={`overflow-hidden bg-[#0A192F]/5 ${i === 0 && work.gallery!.length % 2 !== 0 ? 'md:col-span-2' : ''}`}
                                >
                                    <img
                                        src={urlFor(img).width(1200).url()}
                                        alt={img.alt ?? `${work.title} screenshot ${i + 1}`}
                                        className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-700"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Back link ────────────────────────────────────── */}
                <div className="mt-32 pt-16 border-t border-[#0A192F]/10">
                    <TransitionLink
                        href="/works"
                        className="flex items-center gap-3 text-lg font-light hover:italic transition-all opacity-50 hover:opacity-100"
                    >
                        <ArrowLeft size={20} strokeWidth={1.5} /> All Works
                    </TransitionLink>
                </div>
            </div>
        </div>
    );
}
