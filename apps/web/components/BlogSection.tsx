'use client';

import { useRef } from 'react';
import TransitionLink from './TransitionLink';
import { ArrowRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { urlFor } from '../lib/sanity';
import type { BlogPost } from '../types/sanity';

function formatDate(raw?: string) {
    if (!raw) return '';
    const d = new Date(raw);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

interface BlogSectionProps {
    posts: BlogPost[];
    showViewAll?: boolean;
}

export default function BlogSection({ posts, showViewAll = true }: BlogSectionProps) {
    const pageRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (posts.length === 0) return;

        gsap.utils.toArray<HTMLElement>('.blog-item').forEach((item) => {
            const image = item.querySelector('.blog-image-inner');
            gsap.fromTo(
                image,
                { y: '-15%' },
                { y: '15%', ease: 'none', scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: true } }
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, { scope: pageRef, dependencies: [posts] });

    return (
        <div ref={pageRef}>
            <section className="py-24 md:py-40 px-6 md:px-16 lg:px-24 bg-white min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-12 md:mb-24">
                        <h2 className="text-sm uppercase tracking-widest opacity-60 font-medium">03 // Recent Thoughts</h2>
                        {showViewAll && posts.length > 0 && (
                            <TransitionLink
                                href="/blog"
                                className="group flex items-center gap-2 text-sm uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity font-medium"
                            >
                                View All
                                <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                            </TransitionLink>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12">
                        {posts.map((post, index) => (
                            <TransitionLink key={post._id || index} href={`/blog/${post.slug.current}`}>
                                <article className="blog-item group cursor-pointer">
                                    <div className="aspect-[4/5] overflow-hidden relative mb-10">
                                        {post.coverImage ? (
                                            <img
                                                src={urlFor(post.coverImage).width(600).url()}
                                                alt={post.title}
                                                className="blog-image-inner absolute top-[-20%] left-0 w-full h-[140%] object-cover"
                                            />
                                        ) : (
                                            <div className="blog-image-inner absolute top-[-20%] left-0 w-full h-[140%] bg-[#0A192F]/5" />
                                        )}
                                        <div className="absolute inset-0 bg-[#0A192F] transform translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out" />
                                    </div>
                                    <p className="text-sm opacity-60 mb-4 md:mb-6 font-mono">{formatDate(post.date)}</p>
                                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight leading-snug group-hover:italic transition-all">
                                        {post.title}
                                    </h3>
                                </article>
                            </TransitionLink>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
