import { buildCustomColorScheme } from 'themes/utils';

/** The "Debtflix Blue" color scheme — ocean blue variant. */
const theme = buildCustomColorScheme({
    palette: {
        background: {
            default: '#0a1929',
            paper: '#132f4c'
        },
        primary: {
            main: '#0077B6',
            dark: '#005a8c',
            light: '#0096e0'
        },
        secondary: {
            main: '#0077B6'
        },
        text: {
            primary: '#FFFFFF',
            secondary: 'rgba(255, 255, 255, 0.7)'
        },
        action: {
            focus: '#0077B6',
            hover: 'rgba(0, 119, 182, 0.2)'
        },
        AppBar: {
            defaultBg: '#0a1929'
        },
        Button: {
            inheritContainedBg: 'rgba(255, 255, 255, 0.1)',
            inheritContainedHoverBg: 'rgba(255, 255, 255, 0.2)'
        }
    }
});

export default theme;
