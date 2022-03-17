import React, { FunctionComponent } from "react";

export enum ElementSize {
    "large", "medium", "small", "tiny"
}

export enum ElementVariant {
    "solid", "outlined", "light"
}

interface ThemeProps {
}

export const Theme: FunctionComponent<ThemeProps> = (props) => {
    const {children} = props;

    return (
        <div className="dark">
            {children}
        </div>
    );
};
