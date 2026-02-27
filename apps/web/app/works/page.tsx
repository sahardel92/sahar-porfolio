import type { Metadata } from 'next';
import { getWorks } from '../../lib/sanity';
import WorksSection from '../../components/WorksSection';

export const revalidate = 60;

export const metadata: Metadata = {
    title: 'Works — Portfolio',
    description: 'Selected works and projects showcasing web development, design, and full-stack capabilities.',
};

export default async function WorksPage() {
    const works = await getWorks().catch(() => []);

    return <WorksSection works={works} />;
}
