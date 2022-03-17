import { faWrench } from "@fortawesome/free-solid-svg-icons/faWrench";
import React, { FunctionComponent } from "react";
import { DavitButtonProps } from "./DavitButton";
import { DavitIconButton } from "./DavitIconButton";

interface DavitEditButtonProps extends DavitButtonProps {
}

export const DavitEditButton: FunctionComponent<DavitEditButtonProps> = (props) => {
    const {onClick} = props;

    return <DavitIconButton onClick={onClick}
                            iconName={faWrench}
    />;
};
