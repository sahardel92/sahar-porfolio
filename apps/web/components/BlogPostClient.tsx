'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { urlFor } from '../lib/sanity';
import type { BlogPost } from '../types/sanity';

function formatDate(raw?: string) {
    if (!raw) return '';
    const d = new Date(raw);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

const ptComponents: PortableTextComponents = {
    block: {
        h2: ({ children }) => (
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mt-16 mb-6 text-[#0A192F]">
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mt-12 mb-4 text-[#0A192F]">
                {children}
            </h3>
        ),
        normal: ({ children }) => (
            <p className="text-lg md:text-xl leading-relaxed mb-6 text-[#0A192F]/75 font-light">
                {children}
            </p>
        ),
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#0A192F]/25 pl-6 md:pl-8 my-10 text-xl md:text-2xl italic text-[#0A192F]/60 font-light leading-relaxed">
                {children}
            </blockquote>
        ),
    },
    marks: {
        strong: ({ children }) => <strong className="font-semibold text-[#0A192F]">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        code: ({ children }) => (
            <code className="bg-[#0A192F]/5 px-2 py-0.5 rounded text-base font-mono text-[#0A192F]/80">
                {children}
            </code>
        ),
        link: ({ value, children }) => (
            <a
                href={value?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 decoration-[#0A192F]/30 hover:decoration-[#0A192F] transition-colors"
            >
                {children}
            </a>
        ),
    },
    types: {
        image: ({ value }) => {
            if (!value?.asset) return null;
            return (
                <figure className="my-12">
                    <img
                        src={urlFor(value).width(1200).url()}
                        alt={value.alt || ''}
                        className="w-full rounded-sm"
                    />
                    {value.caption && (
                        <figcaption className="text-sm text-[#0A192F]/40 mt-3 text-center font-mono">
                            {value.caption}
                        </figcaption>
                    )}
                </figure>
            );
        },
    },
};

interface BlogPostClientProps {
    post: BlogPost;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
    const pageRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        tl.fromTo('.blog-back-link', { x: -30, opacity: 0 }, { x: 0, opacity: 0.6, duration: 0.8 })
            .fromTo('.blog-date', { y: 20, opacity: 0 }, { y: 0, opacity: 0.4, duration: 0.6 }, '-=0.4')
            .fromTo('.blog-title-line', { y: '100%' }, { y: '0%', duration: 1.2, stagger: 0.15 }, '-=0.4')
            .fromTo('.blog-excerpt', { y: 30, opacity: 0 }, { y: 0, opacity: 0.7, duration: 0.8 }, '-=0.6')
            .fromTo('.blog-cover', { scale: 1.1, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2 }, '-=0.8');

        // Body content — reveal elements on scroll
        gsap.utils.toArray<HTMLElement>('.blog-body > *').forEach((el) => {
            gsap.fromTo(
                el,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
                }
            );
        });

        // Cover image parallax
        const coverImg = pageRef.current?.querySelector('.blog-cover-img');
        if (coverImg) {
            gsap.fromTo(
                coverImg,
                { y: '-10%' },
                { y: '10%', ease: 'none', scrollTrigger: { trigger: '.blog-cover', start: 'top bottom', end: 'bottom top', scrub: true } }
            );
        }

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, { scope: pageRef });

    // Split title into lines for reveal animation
    const titleWords = post.title.split(' ');
    const midPoint = Math.ceil(titleWords.length / 2);
    const titleLines = [
        titleWords.slice(0, midPoint).join(' '),
        titleWords.slice(midPoint).join(' '),
    ].filter(Boolean);

    return (
        <div ref={pageRef}>
            <section className="min-h-screen px-6 md:px-16 lg:px-24 pt-32 md:pt-40 pb-24">
                <div className="max-w-4xl mx-auto">
                    {/* Back link */}
                    <Link
                        href="/blog"
                        className="blog-back-link flex items-center gap-3 text-base md:text-lg font-light hover:italic transition-all mb-16 md:mb-24 opacity-0"
                    >
                        <ArrowLeft size={20} strokeWidth={1.5} /> Back to Blog
                    </Link>

                    {/* Date */}
                    <p className="blog-date text-sm opacity-0 mb-6 md:mb-8 font-mono">{formatDate(post.date)}</p>

                    {/* Title with line reveal */}
                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter leading-[0.85] mb-12 md:mb-16">
                        {titleLines.map((line, i) => (
                            <div key={i} className="overflow-hidden">
                                <div className="blog-title-line translate-y-full">{line}</div>
                            </div>
                        ))}
                    </h1>

                    {/* Excerpt */}
                    {post.excerpt && (
                        <p className="blog-excerpt text-lg md:text-2xl font-light leading-relaxed opacity-0 mb-12 md:mb-16 border-l-4 border-[#0A192F]/20 pl-6 md:pl-8">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Cover image with parallax */}
                    {post.coverImage && (
                        <div className="blog-cover w-full aspect-video overflow-hidden mb-16 md:mb-24 bg-[#0A192F]/5 opacity-0">
                            <img
                                src={urlFor(post.coverImage).width(1600).url()}
                                alt={post.title}
                                className="blog-cover-img w-full h-[120%] object-cover"
                            />
                        </div>
                    )}

                    {/* Separator */}
                    <div className="w-16 h-[2px] bg-[#0A192F]/15 mb-12 md:mb-16" />

                    {/* Body content with scroll reveals */}
                    {post.body && (
                        <div className="blog-body">
                            <PortableText value={post.body as any} components={ptComponents} />
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
