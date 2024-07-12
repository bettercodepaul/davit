import React, { FunctionComponent, useEffect, useState } from "react";
import { DavitIcons } from "../icons/IconSet";
import { DavitButtonProps } from "./DavitButton";
import "./DavitDeleteButton.css";
import { DavitIconButton } from "./DavitIconButton";

interface DavitDeleteButtonProps extends DavitButtonProps {
    noConfirm?: boolean;
}

export const DavitDeleteButton: FunctionComponent<DavitDeleteButtonProps> = (props) => {
    const {onClick, disabled, noConfirm} = props;

    const SHRINK_DELAY: number = 3000;

    const [fluid, setFluid] = useState<boolean>(false);

    // TODO: BUG JIRA => CARV2-227
    useEffect(() => {
        if (fluid) setTimeout(() => setFluid(false), SHRINK_DELAY);
    }, [fluid]);

    const clickEventHandler = () => {
        if (fluid || noConfirm) {
            onClick();
        } else {
            setFluid(true);
        }
    };

    return (
        <DavitIconButton
            iconName={fluid ? undefined : DavitIcons.trash}
            onClick={clickEventHandler}
            className={fluid ? "deleteButton fluid padding-vertical-small padding-horizontal-medium border" : "deleteButton"}
            disabled={disabled}
        >
            {fluid ? "SURE" : undefined}
        </DavitIconButton>
    );
};
