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

export const IconActorDuplicate: React.FC<IconProps> = ({
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
                        <path d="M9.497 22.5H18.5s0-3.352-.474-4.781c-.413-1.244-3.396-2.076-6.526-3.255v-2.5s1-.619 1-3c1 0 1-2 0-2 0-.234 1.078-1.678.75-3-.474-1.904-6.151-1.904-6.625 0-2.369-.476-1.125 2.681-1.125 3v2c0 2.381 2 3 2 3v2.5C4.722 15.52 1.386 16.476.974 17.719.5 19.148.5 22.5.5 22.5h8.997z"
                              fill="none"
                              stroke={color}
                        />
                        <path d="M21 22.5h2.5s0-3.352-.474-4.781c-.413-1.244-3.396-2.576-6.526-3.755v-1.5s1-.619 1-3c1 0 1-2 0-2 0-.234 1.078-1.862.75-3.184-.222-.891-2.125-2.298-3.625-1.298"
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
