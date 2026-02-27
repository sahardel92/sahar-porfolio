import type { Metadata } from 'next';
import { getSkills } from '../../lib/sanity';
import SkillsSection from '../../components/SkillsSection';

export const revalidate = 60;

export const metadata: Metadata = {
    title: 'Skills — Portfolio',
    description: 'My technical skills and areas of expertise in web development and design.',
};

export default async function SkillsPage() {
    const skills = await getSkills().catch(() => []);

    return <SkillsSection skills={skills} />;
}
