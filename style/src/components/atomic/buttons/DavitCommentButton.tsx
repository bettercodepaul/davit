import { faComment, faCommentDots } from "@fortawesome/free-solid-svg-icons";
import React, { FunctionComponent, useState } from "react";
import { DavitIconButton } from ".";
import { DavitNoteModal } from "../modals/DavitNoteModal";
import { DavitButton } from "./DavitButton";

export interface DavitCommentButtonProps {
    onSaveCallback: (comment: string) => void;
    comment: string;
}

export const DavitCommentButton: FunctionComponent<DavitCommentButtonProps> = (props) => {
    const {onSaveCallback, comment} = props;

    const [showForm, setShowForm] = useState<boolean>(false);

    return (
        <>
            <DavitIconButton onClick={() => setShowForm(true)}
                         iconName={comment === "" ? faComment : faCommentDots}
            />
            {showForm &&
            <DavitNoteModal text={comment}
                            closeCallback={() => setShowForm(false)}
                            saveTextCallback={onSaveCallback}
            />
            }
        </>
    );
};
