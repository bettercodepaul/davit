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

export const IconLayersHide: React.FC<IconProps> = ({
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
                        <path d="M1 .5l22.224 22.225"
                              fill="none"
                              stroke={color}
                              strokeLinecap="round"
                        />
                        <path d="M12 14.062l-11.5-5"
                              fill="none"
                              stroke={color}
                              strokeLinecap="round"
                        />
                        <path d="M23.5 9.062l-7.447 3.239"
                              fill="none"
                              stroke={color}
                              strokeLinecap="round"
                        />
                        <path d="M13.374 16.465L12 17.062l-11.5-5"
                              fill="none"
                              stroke={color}
                              strokeLinecap="round"
                        />
                        <path d="M23.5 12.062l-5.456 2.373"
                              fill="none"
                              stroke={color}
                              strokeLinecap="round"
                        />
                        <path d="M15.992 18.327L12 20.062l-11.5-5"
                              fill="none"
                              stroke={color}
                              strokeLinecap="round"
                        />
                        <path d="M23.5 15.062l-3.416 1.486"
                              fill="none"
                              stroke={color}
                              strokeLinecap="round"
                        />
                        <path d="M6.976 3.248L12 1.062l11.5 5-9.524 4.142"
                              fill="none"
                              stroke={color}
                              strokeLinecap="round"
                        />
                        <path d="M6.963 8.872L.5 6.062l2.48-1.077"
                              fill="none"
                              stroke={color}
                              strokeLinecap="round"
                        />
                    </g>
                </g>
                <path id="Invisible_Shape"
                      d="M0 0h24v24H0z"
                      fill="none"
                />
            </g>
        </svg>
    );
};
