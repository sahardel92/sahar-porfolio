'use client';

import {
    createContext,
    useContext,
    useRef,
    useState,
    useCallback,
    useEffect,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

const pageEase = CustomEase.create(
    'pageTransition',
    'M0,0 C0.38,0.05 0.48,0.58 0.65,0.82 0.82,1 1,1 1,1',
);

interface PageTransitionContextType {
    navigateTo: (href: string) => void;
    isTransitioning: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextType>({
    navigateTo: () => { },
    isTransitioning: false,
});

export function usePageTransition() {
    return useContext(PageTransitionContext);
}

export default function PageTransitionProvider({
    children,
    header,
}: {
    children: React.ReactNode;
    header?: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    // Always keep track of latest pathname & children in refs to avoid stale closures
    const latestPathname = useRef(pathname);
    latestPathname.current = pathname;
    const latestChildren = useRef(children);
    latestChildren.current = children;

    const [isTransitioning, setIsTransitioning] = useState(false);
    const [displayChildren, setDisplayChildren] = useState(children);

    const contentRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const pendingPath = useRef<string | null>(null);

    const animationStatus = useRef<'idle' | 'covering' | 'covered' | 'revealing'>('idle');

    // Reveal logic
    const revealNewPage = useCallback(() => {
        animationStatus.current = 'revealing';
        const content = contentRef.current;
        const overlay = overlayRef.current;

        if (content) {
            gsap.set(content, {
                y: 0,
                scale: 1,
                opacity: 1,
                clearProps: 'transform',
            });
        }

        // Delay 1 frame to let React apply the new displayChildren to the DOM
        requestAnimationFrame(() => {
            window.scrollTo(0, 0);

            if (overlay) {
                gsap.to(overlay, {
                    clipPath: 'inset(0% 0% 100% 0%)',
                    duration: 0.6,
                    ease: pageEase,
                    onComplete: () => {
                        animationStatus.current = 'idle';
                        setIsTransitioning(false);
                        pendingPath.current = null;
                        gsap.set(overlay, { visibility: 'hidden' });
                    },
                });
            } else {
                animationStatus.current = 'idle';
                setIsTransitioning(false);
                pendingPath.current = null;
            }
        });
    }, []);

    // Watch for children/pathname changes to trigger reveal if we were waiting
    useEffect(() => {
        if (animationStatus.current === 'idle') {
            // Not transitioning, so keep display transparent to Next.js updates
            setDisplayChildren(children);
        } else if (animationStatus.current === 'covered') {
            // We are fully covered, wait for Next.js to finish routing
            if (pathname === pendingPath.current || pathname === pendingPath.current + '/') {
                setDisplayChildren(children);
                revealNewPage();
            }
        }
    }, [children, pathname, revealNewPage]);

    const navigateTo = useCallback(
        (href: string) => {
            // Strip any trailing slash for consistent comparison, ignore exact same route
            const targetPath = href.split('?')[0].replace(/\/$/, '') || '/';
            const currentPath = pathname.replace(/\/$/, '') || '/';

            if (targetPath === currentPath || isTransitioning) return;

            setIsTransitioning(true);
            pendingPath.current = targetPath;
            animationStatus.current = 'covering';

            const content = contentRef.current;
            const overlay = overlayRef.current;

            if (!content || !overlay) {
                router.push(href);
                return;
            }

            // Fire routing IMMEDIATELY in the background
            router.push(href);

            // Reset overlay to start hidden at bottom
            gsap.set(overlay, {
                clipPath: 'inset(100% 0% 0% 0%)',
                visibility: 'visible',
            });

            const tl = gsap.timeline({
                onComplete: () => {
                    animationStatus.current = 'covered';

                    const currentLatestPath = latestPathname.current.replace(/\/$/, '') || '/';

                    // If routing finished before animation completed, we can reveal instantly
                    if (currentLatestPath === targetPath) {
                        setDisplayChildren(latestChildren.current);
                        revealNewPage();
                    }
                },
            });

            // Shrink/fade current page (matching codrops)
            tl.to(content, {
                y: '-20vh',
                opacity: 0.4,
                scale: 0.85,
                duration: 0.6,
                force3D: true,
                ease: pageEase,
            }, 0);

            // Slide up overlay simultaneously
            tl.to(overlay, {
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 0.6,
                force3D: true,
                ease: pageEase,
            }, 0);
        },
        [pathname, isTransitioning, router, revealNewPage],
    );

    return (
        <PageTransitionContext.Provider value={{ navigateTo, isTransitioning }}>
            {header}
            <div
                ref={overlayRef}
                className="page-transition-overlay"
                style={{
                    clipPath: 'inset(100% 0% 0% 0%)',
                    visibility: 'hidden',
                }}
            />
            <div ref={contentRef} style={{ willChange: 'transform, opacity' }}>
                {displayChildren}
            </div>
        </PageTransitionContext.Provider>
    );
}
