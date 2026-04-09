import { createTheme } from '@mui/material/styles';

import { DEFAULT_THEME_OPTIONS } from './_base/theme';
import appletv from './appletv';
import blueradiance from './blueradiance';
import dark from './dark';
import debtflix from './debtflix';
import debtflixBlue from './debtflix-blue';
import debtflixGold from './debtflix-gold';
import debtflixGreen from './debtflix-green';
import debtflixPurple from './debtflix-purple';
import light from './light';
import purplehaze from './purplehaze';
import wmc from './wmc';

/** The default theme containing all color scheme variants. */
const DEFAULT_THEME = createTheme({
    cssVariables: {
        cssVarPrefix: 'jf',
        colorSchemeSelector: '[data-theme="%s"]',
        disableCssColorScheme: true
    },
    defaultColorScheme: 'debtflix',
    ...DEFAULT_THEME_OPTIONS,
    colorSchemes: {
        appletv,
        blueradiance,
        dark,
        debtflix,
        'debtflix-blue': debtflixBlue,
        'debtflix-gold': debtflixGold,
        'debtflix-green': debtflixGreen,
        'debtflix-purple': debtflixPurple,
        light,
        purplehaze,
        wmc
    }
});

export default DEFAULT_THEME;
