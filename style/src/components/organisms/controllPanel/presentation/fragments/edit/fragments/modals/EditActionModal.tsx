import React, { FunctionComponent } from "react";
import { DavitModal } from "../../../../../../../atomic";
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
