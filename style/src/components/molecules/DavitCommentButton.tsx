import React, { FunctionComponent, useState } from "react";
import { DavitIconButton, DavitNoteModal } from "../atomic";
import { DavitIcons } from "../atomic/icons/IconSet";

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
                             iconName={comment === "" ? DavitIcons.noteEmpty : DavitIcons.noteFilled}
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
