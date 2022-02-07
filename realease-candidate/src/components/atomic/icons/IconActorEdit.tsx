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

export const IconActorEdit: React.FC<IconProps> = ({
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
                        <path d="M16.999 22.499l-3.5 1 1-3.5 6.5-6.5 2.5 2.5z"
                              fill="none"
                              stroke={color}
                              strokeLinecap="round"
                        />
                        <path d="M18.999 15.499l2.5 2.5"
                              fill="none"
                              stroke={color}
                        />
                        <path d="M14.499 19.999l2.5 2.5"
                              fill="none"
                              stroke={color}
                              strokeLinecap="round"
                        />
                        <path d="M16.432 14.464c-.777-.256-3.932-1.679-4.932-2v-2.5s1.5-.619 1.5-3c1 0 1-2.071 0-2.071 0-.233.896-1.606.568-2.929-.475-1.905-6.061-1.905-6.534 0C4.666 1.488 6 4.646 6 4.964c-.5 0-.5 2 0 2 0 2.381 1.5 3 1.5 3v2.5c-2.5 1.055-6.02 1.756-6.432 3C.594 16.894.5 19.5.5 19.5H11"
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
