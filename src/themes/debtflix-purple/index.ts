import { buildCustomColorScheme } from 'themes/utils';

/** The "Debtflix Purple" color scheme — royal purple variant. */
const theme = buildCustomColorScheme({
    palette: {
        background: {
            default: '#1a0a1f',
            paper: '#2d1536'
        },
        primary: {
            main: '#9C27B0',
            dark: '#7B1FA2',
            light: '#CE93D8'
        },
        secondary: {
            main: '#9C27B0'
        },
        text: {
            primary: '#FFFFFF',
            secondary: 'rgba(255, 255, 255, 0.7)'
        },
        action: {
            focus: '#9C27B0',
            hover: 'rgba(156, 39, 176, 0.2)'
        },
        AppBar: {
            defaultBg: '#1a0a1f'
        },
        Button: {
            inheritContainedBg: 'rgba(255, 255, 255, 0.1)',
            inheritContainedHoverBg: 'rgba(255, 255, 255, 0.2)'
        }
    }
});

export default theme;
