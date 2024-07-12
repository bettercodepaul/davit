import React, { FunctionComponent } from "react";
import { DavitModal } from "../../../../../../../atomic";
import { ChainStateForm } from "../forms/ChainStateForm";

interface EditChainModalProps {
}

export const EditChainStateModal: FunctionComponent<EditChainModalProps> = () => {

    return (
        <DavitModal>
            <ChainStateForm />
        </DavitModal>
    );
};
