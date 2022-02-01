import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FunctionComponent } from "react";

interface DavitCardButtonProps {
    onClick: () => void;
    disable?: boolean;
    icon: IconDefinition;
    isActive?: boolean;
}

export const DavitCardButton: FunctionComponent<DavitCardButtonProps> = (props) => {
    const {onClick, disable, icon, isActive} = props;

    return (
        <button
            onClick={onClick}
            className={"button-small" + (isActive ? " activeButton" : "") + (disable ? " disabled" : "")}
            disabled={disable}
        >
            <FontAwesomeIcon icon={icon} />
        </button>
    );
};
