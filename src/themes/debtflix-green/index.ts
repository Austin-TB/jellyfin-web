import { buildCustomColorScheme } from 'themes/utils';

/** The "Debtflix Green" color scheme — emerald variant. */
const theme = buildCustomColorScheme({
    palette: {
        background: {
            default: '#0d1f0d',
            paper: '#1a2e1a'
        },
        primary: {
            main: '#00C853',
            dark: '#009624',
            light: '#5efc82'
        },
        secondary: {
            main: '#00C853'
        },
        text: {
            primary: '#FFFFFF',
            secondary: 'rgba(255, 255, 255, 0.7)'
        },
        action: {
            focus: '#00C853',
            hover: 'rgba(0, 200, 83, 0.2)'
        },
        AppBar: {
            defaultBg: '#0d1f0d'
        },
        Button: {
            inheritContainedBg: 'rgba(255, 255, 255, 0.1)',
            inheritContainedHoverBg: 'rgba(255, 255, 255, 0.2)'
        }
    }
});

export default theme;
