import React, { FunctionComponent } from "react";
import { DavitButton } from "./DavitButton";

interface DavitRootButtonProps {
    onClick: () => void;
    isRoot: boolean;
}

export const DavitRootButton: FunctionComponent<DavitRootButtonProps> = (props) => {
    const {onClick, isRoot} = props;

    return <DavitButton onClick={onClick}
                        label={isRoot ? "Start" : "Set as Start"}
                        disabled={isRoot}
    />;
};
