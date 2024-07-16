import { FunctionComponent, useState } from "react";
import { DavitIcons } from "../atomic/icons/IconSet";
import {DavitIconButton} from '../atomic/buttons';
import {DavitNoteModal} from '../atomic/modals';

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
