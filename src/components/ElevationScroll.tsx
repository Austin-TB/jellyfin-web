import useScrollTrigger from '@mui/material/useScrollTrigger';
import React, { ReactElement } from 'react';

/**
 * Component that transitions the AppBar background from transparent to solid on scroll.
 * Netflix-style: transparent at top, solid dark background when scrolled.
 */
const ElevationScroll = ({ children, elevate = false }: { children: ReactElement, elevate?: boolean }) => {
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0
    });

    const isScrolled = elevate || trigger;

    return React.cloneElement(children, {
        color: isScrolled ? 'default' : 'transparent',
        elevation: 0,
        sx: {
            ...children.props.sx,
            backgroundColor: isScrolled ?
                'rgba(20, 20, 20, 0.95)' :
                'transparent',
            backgroundImage: 'none',
            transition: 'background-color 0.4s ease',
            backdropFilter: isScrolled ? 'blur(8px)' : 'none'
        }
    });
};

export default ElevationScroll;
