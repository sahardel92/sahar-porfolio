'use client';

import { useState, useRef, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import TransitionLink from './TransitionLink';

const navLinks = [
    { title: 'Home', href: '/' },
    { title: 'About', href: '/about' },
    { title: 'Works', href: '/works' },
    { title: 'Blog', href: '/blog' },
    { title: 'Contact', href: '/contact' },
];

interface HeaderProps {
    siteName?: string;
}

export default function Header({ siteName = 'PORTFOLIO.' }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const prevIsOpen = useRef(isMenuOpen);

    useGSAP(() => {
        const menu = menuRef.current;
        if (!menu) return;

        // Only run animation if state actually changed from previous render
        if (prevIsOpen.current === isMenuOpen) {
            return;
        }
        prevIsOpen.current = isMenuOpen;

        if (isMenuOpen) {
            const progress = { left: 0, right: 0 };
            const tl = gsap.timeline({
                onUpdate: () => {
                    menu.style.clipPath = `polygon(0% 0%, 100% 0%, 100% ${progress.right}%, 0% ${progress.left}%)`;
                },
            });
            tl.to(progress, { left: 100, duration: 1, ease: 'power3.inOut' }, 0)
                .to(progress, { right: 100, duration: 1.3, ease: 'power4.inOut' }, 0);
        } else {
            const progress = { left: 100, right: 100 };
            const tl = gsap.timeline({
                onUpdate: () => {
                    menu.style.clipPath = `polygon(0% 0%, 100% 0%, 100% ${progress.right}%, 0% ${progress.left}%)`;
                },
            });
            tl.to(progress, { left: 0, duration: 1, ease: 'power3.inOut' }, 0)
                .to(progress, { right: 0, duration: 0.8, ease: 'power4.inOut' }, 0);
        }
    }, [isMenuOpen]);

    // Close the menu instantly (no animation) — used before page transitions
    const closeMenuInstantly = useCallback(() => {
        const menu = menuRef.current;
        if (menu && isMenuOpen) {
            // Reset clip-path immediately to hidden state
            menu.style.clipPath = 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)';
            setIsMenuOpen(false);
        }
        document.body.style.overflow = 'unset';
    }, [isMenuOpen]);

    return (
        <>
            <header className="fixed top-0 left-0 w-full p-6 md:p-8 lg:p-12 flex justify-between items-center z-50 mix-blend-difference text-white">
                <div className="text-lg md:text-2xl font-bold tracking-tighter transition-all select-none">
                    {siteName}
                </div>
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="p-2 hover:opacity-70 transition-opacity"
                    aria-label="Open Menu"
                >
                    <Menu size={28} className="md:w-9 md:h-9" strokeWidth={1.5} />
                </button>
            </header>

            <div
                ref={menuRef}
                className="fixed inset-0 bg-[#0A192F] text-white z-60 flex flex-col justify-center items-center"
                style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' }}
            >
                <button
                    onClick={() => setIsMenuOpen(false)}
                    className="absolute top-6 right-6 md:top-12 md:right-12 p-2 hover:opacity-70 transition-opacity"
                    aria-label="Close Menu"
                >
                    <X size={40} className="md:w-12 md:h-12" strokeWidth={1.5} />
                </button>

                <nav className="flex flex-col items-start justify-center gap-4 md:gap-6 w-full max-w-4xl px-8 mt-12">
                    {navLinks.map((link, index) => (
                        <TransitionLink
                            key={link.title}
                            href={link.href}
                            onBeforeTransition={closeMenuInstantly}
                            className="group relative flex items-center justify-between w-full py-4 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter hover:text-white transition-colors"
                        >
                            <div className="flex items-center gap-6 md:gap-12 w-full">
                                <span className="text-sm md:text-lg font-mono opacity-30 group-hover:opacity-100 transition-opacity duration-500">
                                    0{index + 1}
                                </span>
                                <span className="transform group-hover:translate-x-4 md:group-hover:translate-x-8 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] text-neutral-300 group-hover:text-white">
                                    {link.title}
                                </span>
                            </div>
                            <div className="w-0 h-[1px] md:h-[2px] bg-white absolute bottom-0 left-0 group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] opacity-30 group-hover:opacity-100" />
                        </TransitionLink>
                    ))}
                </nav>
            </div>
        </>
    );
}
