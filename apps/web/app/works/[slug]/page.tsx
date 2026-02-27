import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getWork, getWorks } from '../../../lib/sanity';
import WorkDetailClient from '../../../components/WorkDetailClient';

export const revalidate = 60;

// Pre-generate pages for all known works at build time
export async function generateStaticParams() {
    const works = await getWorks().catch(() => []);
    return works.map((work) => ({
        slug: work.slug.current,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const work = await getWork(slug).catch(() => null);
    if (!work) return { title: 'Work Not Found — Portfolio' };

    return {
        title: `${work.title} — Portfolio`,
        description: work.description ?? `${work.title} — ${work.category} project`,
    };
}

export default async function WorkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const work = await getWork(slug).catch(() => null);

    if (!work) {
        notFound();
    }

    return <WorkDetailClient work={work} />;
}
