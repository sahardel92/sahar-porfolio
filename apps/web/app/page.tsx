import { getPersonalInfo, getWorks, getBlogPosts } from '../lib/sanity';
import HeroSection from '../components/HeroSection';
import WorksSection from '../components/WorksSection';
import BlogSection from '../components/BlogSection';
import ContactSection from '../components/ContactSection';

// ISR: revalidate every 60 seconds
export const revalidate = 60;

export default async function HomePage() {
    // Fetch all data server-side in parallel
    const [info, works, posts] = await Promise.all([
        getPersonalInfo().catch(() => null),
        getWorks().catch(() => []),
        getBlogPosts().catch(() => []),
    ]);

    return (
        <>
            <HeroSection info={info} />
            <WorksSection works={works} />
            <BlogSection posts={posts.slice(0, 3)} />
            <ContactSection info={info} />
        </>
    );
}
