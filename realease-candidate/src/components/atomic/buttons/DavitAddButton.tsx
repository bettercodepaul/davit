import React, { CSSProperties, FunctionComponent } from "react";
import { DavitIcons } from "../icons/IconSet";
import { DavitButton } from "./DavitButton";

interface DavitAddButtonProps {
    onClick: () => void;
    style?: CSSProperties;
}

export const DavitAddButton: FunctionComponent<DavitAddButtonProps> = (props) => {
    const {onClick, style} = props;

    return <DavitButton onClick={onClick}
                        iconName={DavitIcons.plus}
                        style={style}
    />;
};
