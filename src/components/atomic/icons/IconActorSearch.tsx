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

export const IconActorSearch: React.FC<IconProps> = ({
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
                        <circle cx="18"
                                cy="18"
                                fill="none"
                                r="3.5"
                                stroke={color}
                        />
                        <path d="M23.5 23.5l-3.026-3.025"
                              fill="none"
                              stroke={color}
                              strokeLinecap="round"
                        />
                        <path d="M14.466 13.354c-.778-.258-1.966-.534-2.466-.854V10s1.5-.619 1.5-3c.5 0 .5-2.07 0-2.07 0-.235.732-1.608.403-2.93C13.43.096 7.925.096 7.452 2 5.084 1.525 6.5 4.681 6.5 5c-1 0-1 2 0 2 0 2.381 1.5 3 1.5 3v2.5c-3 1.057-6.185 1.756-6.597 3-.474 1.43-.903 4-.903 4h11"
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
