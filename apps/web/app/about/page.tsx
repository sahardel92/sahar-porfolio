import type { Metadata } from 'next';
import { getAbout } from '../../lib/sanity';
import AboutSection from '../../components/AboutSection';

export const revalidate = 60;

export const metadata: Metadata = {
    title: 'About — Portfolio',
    description: 'Learn more about me.',
};

export default async function AboutPage() {
    const aboutData = await getAbout().catch(() => null);

    return <AboutSection about={aboutData} />;
}
