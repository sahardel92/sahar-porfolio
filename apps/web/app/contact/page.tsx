import type { Metadata } from 'next';
import { getPersonalInfo } from '../../lib/sanity';
import ContactSection from '../../components/ContactSection';

export const revalidate = 60;

export const metadata: Metadata = {
    title: 'Contact — Portfolio',
    description: 'Get in touch — let\'s create something together.',
};

export default async function ContactPage() {
    const info = await getPersonalInfo().catch(() => null);

    return <ContactSection info={info} />;
}
