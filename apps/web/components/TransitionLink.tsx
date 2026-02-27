'use client';

import Link from 'next/link';
import { usePageTransition } from './PageTransition';
import type { ComponentProps, MouseEvent } from 'react';

type TransitionLinkProps = ComponentProps<typeof Link> & {
    /** If true, skip the transition animation (use normal navigation) */
    noTransition?: boolean;
    /** Optional callback before transition starts (e.g. close menu) */
    onBeforeTransition?: () => void;
};

export default function TransitionLink({
    href,
    noTransition = false,
    onBeforeTransition,
    onClick,
    children,
    ...props
}: TransitionLinkProps) {
    const { navigateTo, isTransitioning } = usePageTransition();

    function handleClick(e: MouseEvent<HTMLAnchorElement>) {
        // Let external links behave normally
        const hrefString = typeof href === 'string' ? href : href.pathname || '';
        const isExternal =
            hrefString.startsWith('http') ||
            hrefString.startsWith('mailto:') ||
            hrefString.startsWith('tel:');

        if (isExternal || noTransition) {
            onClick?.(e);
            return;
        }

        e.preventDefault();

        if (isTransitioning) return;

        // Fire any pre-transition callback (e.g. close menu)
        onBeforeTransition?.();

        // Fire the original onClick if provided
        onClick?.(e);

        // Trigger the page transition
        navigateTo(hrefString);
    }

    return (
        <Link href={href} onClick={handleClick} {...props}>
            {children}
        </Link>
    );
}
