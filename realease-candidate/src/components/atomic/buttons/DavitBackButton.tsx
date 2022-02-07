import React, { FunctionComponent } from "react";
import { DavitIcons } from "../icons/IconSet";
import { DavitButton } from "./DavitButton";

interface DavitBackButtonProps {
    onClick: () => void;
}

export const DavitBackButton: FunctionComponent<DavitBackButtonProps> = (props) => {
    const {onClick} = props;

    return <DavitButton onClick={onClick}
                        iconName={DavitIcons.back}
    />;
};
