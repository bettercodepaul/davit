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

export const IconHide: React.FC<IconProps> = ({
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
                        <path d="M19.518 8.288C21.957 10.052 23.5 12 23.5 12s-5.148 6.5-11.5 6.5c-1.039 0-2.045-.173-3.002-.464"
                              fill="none"
                              stroke={color}
                              strokeLinecap="round"
                        />
                        <path d="M4.468 15.701C2.037 13.94.5 12 .5 12S5.648 5.5 12 5.5c.859 0 1.698.119 2.504.325"
                              fill="none"
                              stroke={color}
                              strokeLinecap="round"
                        />
                        <path d="M8 12a4 4 0 0 1 4-4"
                              fill="none"
                              stroke={color}
                              strokeLinecap="round"
                        />
                        <path d="M16 12a4 4 0 0 1-4 4"
                              fill="none"
                              stroke={color}
                              strokeLinecap="round"
                        />
                        <path d="M21.75 2.25l-19.5 19.5"
                              fill="none"
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
