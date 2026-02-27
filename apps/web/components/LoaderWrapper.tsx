'use client';

import { useState, useEffect } from 'react';
import Loader from './Loader';

const SESSION_KEY = 'portfolio-visited';

export default function LoaderWrapper({ children }: { children: React.ReactNode }) {
    const [showLoader, setShowLoader] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const visited = sessionStorage.getItem(SESSION_KEY);
        if (!visited) {
            setShowLoader(true);
        }
        setMounted(true);
    }, []);

    function handleLoaderDone() {
        sessionStorage.setItem(SESSION_KEY, '1');
        setShowLoader(false);
    }

    // Don't render loader on server — wait for client mount
    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <>
            {showLoader && <Loader onExitComplete={handleLoaderDone} />}
            {children}
        </>
    );
}
