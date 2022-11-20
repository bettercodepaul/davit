import React, { FunctionComponent } from "react";
import { DavitIcons } from "../icons/IconSet";
import { DavitButtonProps } from "./DavitButton";
import { DavitIconButton } from "./DavitIconButton";

interface DavitAddButtonProps extends DavitButtonProps {
}

export const DavitAddButton: FunctionComponent<DavitAddButtonProps> = (props) => {
    const {onClick, dataTestId} = props;

    return <DavitIconButton onClick={onClick}
                            iconName={DavitIcons.plus}
                            dataTestId={dataTestId}
    />;
};
