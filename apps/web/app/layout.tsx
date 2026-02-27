import type { Metadata } from 'next';
import { getPersonalInfo } from '../lib/sanity';
import Header from '../components/Header';
import SmoothScrollProvider from '../components/SmoothScrollProvider';
import LoaderWrapper from '../components/LoaderWrapper';
import './globals.css';

export const metadata: Metadata = {
    title: 'Portfolio — Creative Developer',
    description: 'I craft minimal, engaging, and performant digital experiences with a focus on typography and motion.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    // Fetch personal info server-side to get the site name
    const info = await getPersonalInfo().catch(() => null);
    const siteName = info?.name ? `${info.name.toUpperCase()}.` : 'PORTFOLIO.';

    return (
        <html lang="en">
            <body>
                <SmoothScrollProvider>
                    <LoaderWrapper>
                        <div className="bg-white text-[#0A192F] font-sans selection:bg-[#0A192F] selection:text-white overflow-x-hidden">
                            <Header siteName={siteName} />
                            <main>{children}</main>
                        </div>
                    </LoaderWrapper>
                </SmoothScrollProvider>
            </body>
        </html>
    );
}
