import React, { FunctionComponent } from "react";
import { DavitModal } from "../../../../../../../atomic";
import { SequenceStateForm } from "../forms/SequenceStateForm";

interface EditStateModalProps {
}

export const EditSequenceStateModal: FunctionComponent<EditStateModalProps> = () => {

    return (
        <DavitModal>
            <SequenceStateForm />
        </DavitModal>
    );
};
