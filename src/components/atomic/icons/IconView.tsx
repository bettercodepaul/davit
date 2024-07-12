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

export const IconView: React.FC<IconProps> = ({
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
                <g id="Outline_Icons_1_">
                    <g id="Outline_Icons">
                        <path d="M23.5 12s-5.148 6.5-11.5 6.5S.5 12 .5 12 5.648 5.5 12 5.5 23.5 12 23.5 12z"
                              fill="none"
                              stroke={color}
                              strokeLinecap="round"
                        />
                        <circle cx="12"
                                cy="12"
                                fill="none"
                                r="4"
                                stroke={color}
                                strokeLinecap="round"
                        />
                    </g>
                </g>
                <path id="Frames-24px"
                      d="M0 0h24v24H0z"
                      fill="none"
                />
            </g>
        </svg>
    );
};
