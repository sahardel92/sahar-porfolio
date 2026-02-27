import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPost, getBlogPosts } from '../../../lib/sanity';
import BlogPostClient from '../../../components/BlogPostClient';

export const revalidate = 60;

export async function generateStaticParams() {
    const posts = await getBlogPosts().catch(() => []);
    return posts.map((post) => ({
        slug: post.slug.current,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogPost(slug).catch(() => null);
    if (!post) return { title: 'Post Not Found — Portfolio' };

    return {
        title: `${post.title} — Portfolio Blog`,
        description: post.excerpt ?? `${post.title} — blog post`,
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getBlogPost(slug).catch(() => null);

    if (!post) {
        notFound();
    }

    return <BlogPostClient post={post} />;
}
