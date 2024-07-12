import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FunctionComponent } from "react";

interface DavitButtonIconProps {
    onClick: () => void;
    icon: IconDefinition;
    active?: boolean;
}

export const DavitSidePanelButton: FunctionComponent<DavitButtonIconProps> = (props) => {
    const {onClick, icon, active} = props;

    return (
        <button className={"sidePanelButton" + (active ? " active" : "")}
                onClick={onClick}
        >
            <FontAwesomeIcon icon={icon} />
        </button>
    );
};
