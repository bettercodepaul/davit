import React from "react";
import "../src/style/index.css";

const customViewports = {
    appleIphone12: {
        name: "Apple iPhone 12 Pro",
        styles: {
            width: "390px",
            height: "844px",
        },
    },
    appleIphone11: {
        name: "Apple iPhone 11 Pro",
        styles: {
            width: "375px",
            height: "812px",
        },
    },
    appleIphoneSE: {
        name: "Apple iPhone SE",
        styles: {
            width: "320px",
            height: "568px",
        },
    },
    appleIpadAit: {
        name: "Apple iPad Air",
        styles: {
            width: "834px",
            height: "1112px",
        },
    },
    macbookPro: {
        name: "MacBook Pro",
        styles: {
            width: "1440px",
            height: "900px",
        },
    },
};

export const parameters = {
    actions: {argTypesRegex: "^on[A-Z].*"},
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
        expanded: true,
        presetColors: [
            {color: "#54585B", title: "dark"},
            {color: "#878A8C", title: "dark--lighter"},
            {color: "#F4F4F4", title: "light"},
            {color: "#F7F7F7", title: "light--lighter"},
            {color: "#0D456B", title: "primary"},
            {color: "#567D97", title: "primary--lighter"},
            {color: "#0060A9", title: "primary-variant"},
            {color: "#4D90C3", title: "primary-variant--lighter"},
            {color: "#9D599F", title: "secondary"},
            {color: "#BA8BBC", title: "secondary--lighter"},
            {color: "#A568A8", title: "secondary-variant"},
            {color: "#C095C2", title: "secondary-variant--lighter"},
            {color: "#C8D400", title: "primary-accent"},
            {color: "#D9E14D", title: "primary-accent--lighter"},
            {color: "#35ABE2", title: "secondary-accent"},
            {color: "#72C4EB", title: "secondary-accent--lighter"},
            {color: "#F0BB29", title: "warning"},
            {color: "#F5CF69", title: "warning--lighter"},
            {color: "#C81919", title: "error"},
            {color: "#D95E5E", title: "error--lighter"},
        ]
    },
    viewport: {
        viewports: {
            ...customViewports
        }
    },
    options: {
        storySort: {
            order: [
                "basics",
                "atoms",
                "molecules",
                "organisms",
                "templates",
                "pages",
            ],
        },
    },
};

const withGlobalStyle = (storyFn) => (
    <>
        <div>
            {storyFn()}
        </div>
    </>
);

export const decorators = [withGlobalStyle];
