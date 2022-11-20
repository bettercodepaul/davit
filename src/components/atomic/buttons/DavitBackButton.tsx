import React, { FunctionComponent } from "react";
import { DavitIcons } from "../icons/IconSet";
import { DavitButtonProps } from "./DavitButton";
import { DavitIconButton } from "./DavitIconButton";

interface DavitBackButtonProps extends DavitButtonProps {
}

export const DavitBackButton: FunctionComponent<DavitBackButtonProps> = (props) => {
    const {onClick, dataTestId} = props;

    return <DavitIconButton onClick={onClick}
                            iconName={DavitIcons.back}
                            dataTestId={dataTestId}
    />;
};
