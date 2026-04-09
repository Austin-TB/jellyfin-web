import { buildCustomColorScheme } from 'themes/utils';

/** The "Debtflix Gold" color scheme — gold variant. */
const theme = buildCustomColorScheme({
    palette: {
        background: {
            default: '#1a1400',
            paper: '#2d2400'
        },
        primary: {
            main: '#FFB300',
            dark: '#FF8F00',
            light: '#FFD54F'
        },
        secondary: {
            main: '#FFB300'
        },
        text: {
            primary: '#FFFFFF',
            secondary: 'rgba(255, 255, 255, 0.7)'
        },
        action: {
            focus: '#FFB300',
            hover: 'rgba(255, 179, 0, 0.2)'
        },
        AppBar: {
            defaultBg: '#1a1400'
        },
        Button: {
            inheritContainedBg: 'rgba(255, 255, 255, 0.1)',
            inheritContainedHoverBg: 'rgba(255, 255, 255, 0.2)'
        }
    }
});

export default theme;
