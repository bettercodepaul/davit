import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import React, { FunctionComponent } from "react";
import { DavitButton } from "./DavitButton";

interface DavitTableButtonProps {
    onClick: () => void;
    disable?: boolean;
    icon?: IconDefinition;
}

export const DavitTableButton: FunctionComponent<DavitTableButtonProps> = (props) => {
    const {onClick, icon, disable} = props;

    return (
        <DavitButton iconName={icon}
                     onClick={onClick}
                     disable={disable}
        />
    );
};
