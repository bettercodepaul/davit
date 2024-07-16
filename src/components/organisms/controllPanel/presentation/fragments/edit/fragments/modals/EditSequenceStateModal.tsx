import { FunctionComponent } from "react";
import { SequenceStateForm } from "../forms/SequenceStateForm";
import {DavitModal} from '../../../../../../../atomic/modals';

interface EditStateModalProps {
}

export const EditSequenceStateModal: FunctionComponent<EditStateModalProps> = () => {

    return (
        <DavitModal>
            <SequenceStateForm />
        </DavitModal>
    );
};
