'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface LoaderProps {
    onExitComplete: () => void;
}

export default function Loader({ onExitComplete }: LoaderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);

    useGSAP(() => {
        const counter = counterRef.current;
        const container = containerRef.current;
        if (!counter || !container) return;

        const obj = { val: 0 };

        gsap.to(obj, {
            val: 100,
            duration: 2,
            ease: 'power2.inOut',
            onUpdate() {
                counter.textContent = String(Math.round(obj.val));
            },
            onComplete() {
                gsap.to(container, {
                    y: '-100%',
                    duration: 1,
                    ease: 'power4.inOut',
                    delay: 0.3,
                    onComplete: onExitComplete,
                });
            },
        });
    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[200] bg-[#0A192F] text-white flex flex-col items-center justify-center pointer-events-all"
        >
            <div className="flex flex-col items-center gap-6">
                <span
                    ref={counterRef}
                    className="text-[20vw] md:text-[15vw] font-medium tracking-tighter leading-none tabular-nums"
                >
                    0
                </span>
                <span className="text-xs uppercase tracking-[0.4em] opacity-40 font-medium">
                    PORTFOLIO.
                </span>
            </div>
            <div className="absolute bottom-0 left-0 h-[1px] bg-white/20 w-full">
                <div
                    className="h-full bg-white/60 origin-left"
                    style={{ width: '0%' }}
                    ref={(el) => {
                        if (!el) return;
                        gsap.to(el, {
                            width: '100%',
                            duration: 2,
                            ease: 'power2.inOut',
                        });
                    }}
                />
            </div>
        </div>
    );
}
