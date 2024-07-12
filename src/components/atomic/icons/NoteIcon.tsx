import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FunctionComponent } from "react";
import { DavitIcons } from "./IconSet";

interface NoteIconProps {
    size?:
        | "1x"
        | "2x"
        | "3x"
        | "4x"
        | "5x"
        | "6x"
        | "7x"
        | "8x"
        | "9x"
        | "10x";

    className?: string;
}

export const NoteIcon: FunctionComponent<NoteIconProps> = (props) => {
    const {size, className} = props;

    return (
        <FontAwesomeIcon icon={DavitIcons.noteEmpty}
                         size={size ? size : "1x"}
                         className={className}
        />
    );
};

