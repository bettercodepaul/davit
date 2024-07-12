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

export const IconActorAdd: React.FC<IconProps> = ({
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
                        <circle cx="18.5"
                                cy="18.5"
                                fill="none"
                                r="5"
                                stroke={color}
                        />
                        <path d="M18.5 16v5"
                              fill="none"
                              stroke={color}
                              strokeLinecap="round"
                        />
                        <path d="M21 18.5h-5"
                              fill="none"
                              stroke={color}
                              strokeLinecap="round"
                        />
                        <path d="M13.966 13.282c-.777-.257-1.615-.533-2.466-.854v-2.5s1.5-.619 1.5-3c.782 0 .782-2.071 0-2.071 0-.233.829-1.607.5-2.929-.474-1.904-6.026-1.904-6.5 0-2.369-.477-1 2.681-1 3-.783 0-.783 2 0 2 0 2.381 1.5 3 1.5 3v2.5c-2.778 1.056-6.088 1.756-6.5 3C.526 16.857.5 19.5.5 19.5H11"
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
