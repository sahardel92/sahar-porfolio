import type { Metadata } from 'next';
import { getBlogPosts } from '../../lib/sanity';
import BlogPageClient from '../../components/BlogPageClient';

export const revalidate = 60;

export const metadata: Metadata = {
    title: 'Blog — Portfolio',
    description: 'Thoughts on web development, design, animation, and the craft of building for the web.',
};

export default async function BlogPage() {
    const posts = await getBlogPosts().catch(() => []);

    return <BlogPageClient posts={posts} />;
}
