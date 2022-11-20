import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FunctionComponent } from "react";
import { ElementSize } from "../../../style/Theme";
import { DavitButton, DavitButtonProps } from "./DavitButton";
import "./DavitButton.css";
import "./DavitIconButton.css";

interface DavitIconButtonProps extends DavitButtonProps {
    iconName?: IconDefinition;
    iconLeft?: boolean;
    size?: ElementSize;
    iconColor?: string;
}

export const DavitIconButton: FunctionComponent<DavitIconButtonProps> = (props) => {
    const {onClick, size, className = "", iconName, children, iconLeft, iconColor, dataTestId} = props;

    return (
        <DavitButton onClick={onClick}
                     size={size}
                     className={className}
                     dataTestId={dataTestId}
        >
            {iconName && iconLeft && <FontAwesomeIcon className={children ? "iconButtonIcon" : ""}
                                                      icon={iconName}
                                                      color={iconColor}
            />}
            {children}
            {iconName && !iconLeft && <FontAwesomeIcon className={children ? "iconButtonIcon" : ""}
                                                       icon={iconName}
                                                       color={iconColor}
            />}
        </DavitButton>
    );
};
