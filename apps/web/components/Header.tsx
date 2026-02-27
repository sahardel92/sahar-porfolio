'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const navLinks = [
    { title: 'Home', href: '/' },
    { title: 'Skills', href: '/skills' },
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
    const hasMounted = useRef(false);

    useGSAP(() => {
        const menu = menuRef.current;
        if (!menu) return;

        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }

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

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    }, [isMenuOpen]);

    return (
        <>
            <header className="fixed top-0 left-0 w-full p-6 md:p-8 lg:p-12 flex justify-between items-center z-50 mix-blend-difference text-white">
                <Link href="/" className="text-lg md:text-2xl font-bold tracking-tighter hover:italic transition-all">
                    {siteName}
                </Link>
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

                <nav className="flex flex-col items-center gap-5 md:gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.title}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="menu-link block text-3xl md:text-5xl lg:text-7xl font-light tracking-tight hover:italic hover:text-white/70 transition-all"
                        >
                            {link.title}
                        </Link>
                    ))}
                </nav>
            </div>
        </>
    );
}
