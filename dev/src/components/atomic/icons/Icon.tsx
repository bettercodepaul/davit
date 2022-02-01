import React, { CSSProperties } from "react";
import { IconActorAdd } from "./IconActorAdd";
import { IconActorDuplicate } from "./IconActorDuplicate";
import { IconActorEdit } from "./IconActorEdit";
import { IconActorRemove } from "./IconActorRemove";
import { IconActorSearch } from "./IconActorSearch";
import { IconArrowDown } from "./IconArrowDown";
import { IconArrowLeft } from "./IconArrowLeft";
import { IconArrowRight } from "./IconArrowRight";
import { IconArrowUp } from "./IconArrowUp";
import { IconChevronDown } from "./IconChevronDown";
import { IconChevronLeft } from "./IconChevronLeft";
import { IconChevronRight } from "./IconChevronRight";
import { IconChevronUp } from "./IconChevronUp";
import { IconDown } from "./IconDown";
import { IconHide } from "./IconHide";
import { IconLayers } from "./IconLayers";
import { IconLayersHide } from "./IconLayersHide";
import { IconLeft } from "./IconLeft";
import { IconRight } from "./IconRight";
import { IconThemeMode } from "./IconThemeMode";
import { IconUp } from "./IconUp";
import { IconView } from "./IconView";

export const availableIcons = {
    "theme-mode": "theme-mode",
    "actor-add": "actor-add",
    "actor-edit": "actor-edit",
    "actor-remove": "actor-remove",
    "actor-search": "actor-search",
    "actor-duplicate": "actor-duplicate",
    "up": "up",
    "down": "down",
    "left": "left",
    "right": "right",
    "arrow-up": "arrow-up",
    "arrow-down": "arrow-down",
    "arrow-left": "arrow-left",
    "arrow-right": "arrow-right",
    "chevron-up": "chevron-up",
    "chevron-down": "chevron-down",
    "chevron-left": "chevron-left",
    "chevron-right": "chevron-right",
    "layers": "layers",
    "layers-hide": "layers-hide",
    "view": "view",
    "hide": "hide",
};

export interface IconProps {
    /**
     * The icon name dynamically identifies the expected  <Icon...>
     */
    name: keyof typeof availableIcons,
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

export const Icon: React.FC<IconProps> = ({
                                              name,
                                              size = "1em",
                                              color = "currentColor",
                                              style,
                                              verticalOffset = 0
                                          }: IconProps) => {
    switch (name) {
        case "theme-mode":
            return <IconThemeMode color={color}
                                  size={size}
                                  verticalOffset={verticalOffset}
                                  style={style}
            />;
        case "actor-add":
            return <IconActorAdd color={color}
                                 size={size}
                                 verticalOffset={verticalOffset}
                                 style={style}
            />;
        case "actor-edit":
            return <IconActorEdit color={color}
                                  size={size}
                                  verticalOffset={verticalOffset}
                                  style={style}
            />;
        case "actor-remove":
            return <IconActorRemove color={color}
                                    size={size}
                                    verticalOffset={verticalOffset}
                                    style={style}
            />;
        case "actor-search":
            return <IconActorSearch color={color}
                                    size={size}
                                    verticalOffset={verticalOffset}
                                    style={style}
            />;
        case "actor-duplicate":
            return <IconActorDuplicate color={color}
                                       size={size}
                                       verticalOffset={verticalOffset}
                                       style={style}
            />;
        case "up":
            return <IconUp color={color}
                           size={size}
                           verticalOffset={verticalOffset}
                           style={style}
            />;
        case "down":
            return <IconDown color={color}
                             size={size}
                             verticalOffset={verticalOffset}
                             style={style}
            />;
        case "left":
            return <IconLeft color={color}
                             size={size}
                             verticalOffset={verticalOffset}
                             style={style}
            />;
        case "right":
            return <IconRight color={color}
                              size={size}
                              verticalOffset={verticalOffset}
                              style={style}
            />;
        case "arrow-up":
            return <IconArrowUp color={color}
                                size={size}
                                verticalOffset={verticalOffset}
                                style={style}
            />;
        case "arrow-down":
            return <IconArrowDown color={color}
                                  size={size}
                                  verticalOffset={verticalOffset}
                                  style={style}
            />;
        case "arrow-left":
            return <IconArrowLeft color={color}
                                  size={size}
                                  verticalOffset={verticalOffset}
                                  style={style}
            />;
        case "arrow-right":
            return <IconArrowRight color={color}
                                   size={size}
                                   verticalOffset={verticalOffset}
                                   style={style}
            />;
        case "chevron-up":
            return <IconChevronUp color={color}
                                  size={size}
                                  verticalOffset={verticalOffset}
                                  style={style}
            />;
        case "chevron-down":
            return <IconChevronDown color={color}
                                    size={size}
                                    verticalOffset={verticalOffset}
                                    style={style}
            />;
        case "chevron-left":
            return <IconChevronLeft color={color}
                                    size={size}
                                    verticalOffset={verticalOffset}
                                    style={style}
            />;
        case "chevron-right":
            return <IconChevronRight color={color}
                                     size={size}
                                     verticalOffset={verticalOffset}
                                     style={style}
            />;
        case "layers":
            return <IconLayers color={color}
                               size={size}
                               verticalOffset={verticalOffset}
                               style={style}
            />;
        case "layers-hide":
            return <IconLayersHide color={color}
                                   size={size}
                                   verticalOffset={verticalOffset}
                                   style={style}
            />;
        case "view":
            return <IconView color={color}
                             size={size}
                             verticalOffset={verticalOffset}
                             style={style}
            />;
        case "hide":
            return <IconHide color={color}
                             size={size}
                             verticalOffset={verticalOffset}
                             style={style}
            />;
        default:
            return <IconActorAdd color={color}
                                 size={size}
                                 verticalOffset={verticalOffset}
                                 style={style}
            />;
    }
};
