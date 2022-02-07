import React, { FunctionComponent, useEffect, useState } from "react";
import { DavitIcons } from "../icons/IconSet";
import { DavitButton } from "./DavitButton";

interface DavitDeleteButtonProps {
    onClick: () => void;
    disable?: boolean;
    noConfirm?: boolean;
}

export const DavitDeleteButton: FunctionComponent<DavitDeleteButtonProps> = (props) => {
    const {onClick, disable, noConfirm} = props;

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
        <DavitButton
            iconName={fluid ? undefined : DavitIcons.trash}
            onClick={clickEventHandler}
            className={fluid ? "deleteButton fluid" : "deleteButton"}
            disable={disable}
            label={fluid ? "SURE" : undefined}
        />
    );
};
