import { useEffect, useState } from 'react';

export function useScreenSize() {
    const [screenSize, setScreenSize] = useState(getBreakpoint(window.innerWidth));

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const newBreakpoint = getBreakpoint(width);
            setScreenSize(newBreakpoint);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return screenSize;
}

function getBreakpoint(width: number) {
    if (width < 576) return 'xs';
    if (width >= 576 && width < 768) return 'sm';
    if (width >= 768 && width < 992) return 'md';
    if (width >= 992 && width < 1200) return 'lg';
    if (width >= 1200 && width < 1400) return 'xl';
    return 'xxl';
}
