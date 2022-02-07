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

export const IconThemeMode: React.FC<IconProps> = ({
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
                    <path d="M19.5 15.106L22.606 12 19.5 8.894V4.5h-4.394L12 1.394 8.894 4.5H4.5v4.394L1.394 12 4.5 15.106V19.5h4.394L12 22.606l3.106-3.106H19.5z"
                          fill="none"
                          stroke={color}
                    />
                    <path d="M11.5 6c4 0 6 2.687 6 6s-2 6-6 6V6z"
                          fill="none"
                          stroke={color}
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
