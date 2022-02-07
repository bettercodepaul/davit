import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { CSSProperties, FunctionComponent } from "react";
import "./DavitButton.css";

interface DavitButtonProps {
    onClick: () => void;
    label?: string;
    disable?: boolean;
    iconName?: IconDefinition;
    iconLeft?: boolean;
    className?: string;
    style?: CSSProperties;
}

export const DavitButton: FunctionComponent<DavitButtonProps> = (props) => {
    const {onClick, label, disable, iconName, iconLeft, className, style} = props;

    return (
        <button className={className}
                onClick={onClick}
                disabled={disable}
                style={style}
        >
            {iconName && iconLeft && <FontAwesomeIcon icon={iconName} />}
            {label && <label className={"padding"}>{label}</label>}
            {iconName && !iconLeft && <FontAwesomeIcon icon={iconName} />}
        </button>
    );
};
