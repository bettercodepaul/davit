import React, { FunctionComponent } from "react";
import { DavitNoteForm } from "../forms/DavitNoteForm";
import { DavitModal } from "./DavitModal";

interface DavitNoteModalProps {
    text: string;
    closeCallback: () => void;
    saveTextCallback: (text: string) => void;
}

export const DavitNoteModal: FunctionComponent<DavitNoteModalProps> = (props) => {
    const {text, closeCallback, saveTextCallback} = props;

    return (
        <DavitModal>
            <DavitNoteForm
                text={text}
                onSubmit={(text: string) => {
                    closeCallback();
                    saveTextCallback(text);
                }}
                onCancel={() => closeCallback()}
            />
        </DavitModal>
    );
};
