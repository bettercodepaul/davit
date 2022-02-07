import React, { FunctionComponent } from "react";
import { DavitModal } from "../../../../../../../atomic/modals/DavitModal";
import { ActionForm } from "../forms/ActionForm";

interface EditActionModalProps {

}

export const EditActionModal: FunctionComponent<EditActionModalProps> = () => {

    return (
        <DavitModal>
            <ActionForm />
        </DavitModal>
    );
};
