'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { urlFor } from '../lib/sanity';
import type { BlogPost } from '../types/sanity';

const POSTS_PER_PAGE = 9;

function formatDate(raw?: string) {
    if (!raw) return '';
    const d = new Date(raw);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

interface BlogPageClientProps {
    posts: BlogPost[];
}

export default function BlogPageClient({ posts }: BlogPageClientProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const pageRef = useRef<HTMLDivElement>(null);

    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
    const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
    const currentPosts = posts.slice(startIdx, startIdx + POSTS_PER_PAGE);

    useGSAP(() => {
        if (currentPosts.length === 0) return;

        gsap.utils.toArray<HTMLElement>('.blog-page-item').forEach((item) => {
            const image = item.querySelector('.blog-image-inner');
            if (image) {
                gsap.fromTo(
                    image,
                    { y: '-15%' },
                    { y: '15%', ease: 'none', scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: true } }
                );
            }
        });

        // Entrance animation
        gsap.fromTo(
            '.blog-page-item',
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: 'power3.out' }
        );

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, { scope: pageRef, dependencies: [currentPage] });

    function goToPage(page: number) {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <div ref={pageRef}>
            <section className="py-24 md:py-40 px-6 md:px-16 lg:px-24 bg-white min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-12 md:mb-24">
                        <h1 className="text-sm uppercase tracking-widest opacity-60 font-medium">
                            All Articles ({posts.length})
                        </h1>
                        <Link
                            href="/"
                            className="group flex items-center gap-2 text-sm uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity font-medium"
                        >
                            <ArrowLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" />
                            Back Home
                        </Link>
                    </div>

                    {/* Posts Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
                        {currentPosts.map((post, index) => (
                            <Link key={post._id || index} href={`/blog/${post.slug.current}`}>
                                <article className="blog-page-item group cursor-pointer">
                                    <div className="aspect-[4/5] overflow-hidden relative mb-8">
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
                                    <p className="text-sm opacity-60 mb-3 font-mono">{formatDate(post.date)}</p>
                                    <h3 className="text-xl md:text-2xl lg:text-3xl font-medium tracking-tight leading-snug group-hover:italic transition-all">
                                        {post.title}
                                    </h3>
                                    {post.excerpt && (
                                        <p className="text-sm opacity-50 mt-3 leading-relaxed line-clamp-2">{post.excerpt}</p>
                                    )}
                                </article>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-20 md:mt-32">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 text-sm uppercase tracking-widest font-medium opacity-60 hover:opacity-100 disabled:opacity-20 disabled:cursor-not-allowed transition-opacity px-4 py-3"
                            >
                                <ArrowLeft size={16} />
                                Prev
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => goToPage(page)}
                                        className={`w-10 h-10 flex items-center justify-center text-sm font-mono transition-all duration-300 ${page === currentPage
                                                ? 'bg-[#0A192F] text-white'
                                                : 'opacity-40 hover:opacity-100 hover:bg-[#0A192F]/5'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 text-sm uppercase tracking-widest font-medium opacity-60 hover:opacity-100 disabled:opacity-20 disabled:cursor-not-allowed transition-opacity px-4 py-3"
                            >
                                Next
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
