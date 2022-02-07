export const color = {
    // Palette
    "dark": "#54585B",
    "dark--lighter": "#878A8C",
    "light": "#F4F4F4",
    "light--lighter": "#F7F7F7",
    "dark-blue": "#0D456B",
    "dark-blue--lighter": "#567D97",
    "blue": "#0060A9",
    "blue--lighter": "#4D90C3",
    "lila": "#9D599F",
    "lila--lighter": "#BA8BBC",
    "green": "#C8D400",
    "green--lighter": "#D9E14D",
    "cyan": "#35ABE2",
    "cyan--lighter": "#72C4EB",
    "warning": "#F0BB29",
    "warning--lighter": "#F5CF69",
    "error": "#C81919",
    "error--lighter": "#D95E5E",

    // Monochrome
    "black": "#000000",
    "grey": "#C7C7C7",
    "grey--lighter": "#EAEAEA",
    "white": "#FFFFFF",
};

export const backgrounds = {
    values: [
        {name: "light", value: color.light},
        {name: "dark", value: color.dark},
    ],
};

export const typography = {
    type: {
        "font-family-text": "\"DIN OT\", Helvetica, Arial, sans-serif",
        "font-family-code": "Consolas, Courier, monospace",
    },
    weight: {
        light: "200",
        regular: "400",
        bold: "700",
    },
    size: {
        h1: 16 * 2,
        h2: 16 * 1.75,
        h3: 16 * 1.5,
        h4: 16 * 1.25,
        h5: 16 * 1,
        h6: 16 * 1,
        p: 16 * 1,
    },
} as const;
