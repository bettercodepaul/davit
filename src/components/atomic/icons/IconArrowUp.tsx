import React, { CSSProperties } from "react";

export interface IconProps {
    /**
     * Inherit the font-size of the parent element. The size is used to set height and width of the icon.
     */
    size?: string | "1em" | "100%",
    /**
     * Inherit the color of the parent element
     */
    color?: string | "inherit",
    /**
     * Moves the icon down the vertical axis
     */
    verticalOffset?: number
    /**
     * Custom style definition
     */
    style?: CSSProperties;
}

export const IconArrowUp: React.FC<IconProps> = ({
                                                     size = "1em",
                                                     color = "currentColor",
                                                     style,
                                                     verticalOffset = 0,
                                                     ...props
                                                 }) => {
    const height = size;
    const width = size;
    const offset = -1 * verticalOffset + "px";

    return (
        <svg height={height}
             width={width}
             viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg"
             style={{...style, marginBottom: offset}}
        >
            <g fill={color}>
                <g id="Outline_Icons">
                    <path d="M5.5 5.5l5-5 5 5"
                          fill="none"
                          stroke={color}
                          strokeLinecap="round"
                    />
                    <path d="M10.5.5v23"
                          fill="none"
                          stroke={color}
                          strokeLinecap="round"
                    />
                </g>
                <path id="Invisible_Shape"
                      d="M0 0h24v24H0z"
                      fill="none"
                />
            </g>
        </svg>
    );
};
