import { addons } from "@storybook/addons";
import exxcellentTheme from "./exxcellent.theme";

addons.setConfig({
    theme: exxcellentTheme,
    sidebar: {
        showRoots: true,
        collapsedRoots: [
            "atoms",
            "molecules",
            "organisms",
            "templates",
            "pages",
        ]
    },
});
