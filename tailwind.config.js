/** @type {import("tailwindcss").Config} */

const plugin = require('tailwindcss/plugin')


function withOpacityValue(variable) {
    return ({opacityValue}) => {
        if (opacityValue === undefined) return `rgb(var(${variable})`;
        return `rgb(var(${variable} / ${opacityValue}) `;
    };
}


module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    extend: {
        textColor: {
            skin: {
                primary: "var(color-light)",
                secondary: " var(color-light)",
                tertiary: "var(color-dark)"
            }
        }
    },
    theme: {
        colors: {
            "transparent": "transparent",
            "color-black": "var(--color-black)",
            "color-blue": "var(--color-black)",
            "color-bluelighter": "var(--color-bluelighter)",
            "color-cyan": "var(--color-cyan)",
            "color-cyanlighter": "var(--color-cyanlighter)", /* original theme color: "var(72C4EB)", */
            "color-dark": "var(--color-dark)",
            "color-darklighter": "var(--color-darklighter)",
            "color-dark-blue": "var(--color-dark-blue)",
            "color-dark-bluelighter": "var(--color-dark-bluelighter)",
            "color-error": "var(--color-error)",
            "color-errorlighter": "var(--color-errorlighter)",
            "color-green": "var(--color-green)",
            "color-greenlighter": "var(--color-greenlighter)",
            "color-grey": "var(--color-grey)",
            "color-greylighter": "var(--color-greylighter)",
            "color-light": "var(--color-light)",
            "color-lightlighter": "var(--color-lightlighter)",
            "color-lila": "var(--color-lila)",
            "color-lilalighter": "var(--color-lilalighter)",
            "color-purple": "var(--color-purple)",
            "color-purple-dark": "var(--color-purple-dark)",
            "color-warning": "var(--color-warning)",
            "color-warninglighter": "var(--color-warninglighter)",
            "color-white": "var(--color-white)",
            "data-add-color": "var(--color-green)",
            "2x2-border-color": "var(--color-white)",
            /* secondary */
            "background-color": "var(--color-dark--lighter)",
            /*--secondary-color: var(--color-blue)",*/
            "border-color": "var(--secondary-color)",
            /* tertiary */
            "primary-color": "var(--color-dark-blue)",
            "secondary-color": "var(--color-cyan--lighter)",
            "tertiary-color": "var(--color-grey)",
            /* 2x2 border */
            "background-color-header": "var(--color-dark)",
            /* data */
            "background-color-shadow": "var(--color-black)",
            "data-delete-color": "var(--color-error)",
            "color-hover": "rgba(0, 0, 0, .5)",
            "data-persistent-color": "var(--color-dark--lighter)",
            "data-text-color": "var(--color-black)",
            /*--background-color-header: rgba(0, 0, 0, 0.5)",*/
            "primary-text-color": "var(--color-light)",
            "secondary-text-color": "var(--color-light)",
            "tertiary-text-color": "var(--color-dark)",
        },
    },
    plugins: [
        require("@tailwindcss/forms"),
        plugin(function({ addUtilities }) {
            addUtilities({
                '.content-auto': {
                    'content-visibility': 'auto',
                },
                '.content-hidden': {
                    'content-visibility': 'hidden',
                },
                '.content-visible': {
                    'content-visibility': 'visible',
                },
            })
        })
    ],
};
