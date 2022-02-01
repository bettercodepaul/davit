import React, { FunctionComponent } from "react";
import { DavitButton } from "../../../atomic";

interface ConfigurationSelectButtonProps {
    label: string;
    onClick: () => void;
    isSelected: boolean;
}

export const ConfigurationSelectButton: FunctionComponent<ConfigurationSelectButtonProps> = (props) => {
    const {label, onClick, isSelected} = props;

    return (
        <DavitButton className="width-fluid"
                     onClick={onClick}
                     active={isSelected}
        >
            <h2>{label}</h2>
        </DavitButton>
    );
};

