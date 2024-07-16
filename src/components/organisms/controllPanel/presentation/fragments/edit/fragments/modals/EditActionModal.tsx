import { FunctionComponent } from "react";
import { ActionForm } from "../forms/ActionForm";
import {DavitModal} from '../../../../../../../atomic/modals';

interface EditActionModalProps {

}

export const EditActionModal: FunctionComponent<EditActionModalProps> = () => {

    return (
        <DavitModal>
            <ActionForm />
        </DavitModal>
    );
};
