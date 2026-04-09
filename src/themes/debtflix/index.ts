import { buildCustomColorScheme } from 'themes/utils';

/** The "Debtflix" color scheme — Netflix-inspired dark red theme. */
const theme = buildCustomColorScheme({
    palette: {
        background: {
            default: '#141414',
            paper: '#1a1a1a'
        },
        primary: {
            main: '#E50914',
            dark: '#B20710',
            light: '#FF1A25'
        },
        secondary: {
            main: '#E50914'
        },
        text: {
            primary: '#FFFFFF',
            secondary: 'rgba(255, 255, 255, 0.7)'
        },
        action: {
            focus: '#E50914',
            hover: 'rgba(229, 9, 20, 0.2)'
        },
        AppBar: {
            defaultBg: '#141414'
        },
        Button: {
            inheritContainedBg: 'rgba(255, 255, 255, 0.1)',
            inheritContainedHoverBg: 'rgba(255, 255, 255, 0.2)'
        }
    }
});

export default theme;
