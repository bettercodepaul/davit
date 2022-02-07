import React, { FunctionComponent } from "react";
import { DavitDraggableModal } from "../../../../../../../atomic/modals/DavitDraggableModal";
import { ChainDecisionForm } from "../forms/ChainDecisionForm";

interface EditChainDecisionModalProps {

}

export const EditChainDecisionModal: FunctionComponent<EditChainDecisionModalProps> = () => {

    return (
        <DavitDraggableModal form={<ChainDecisionForm />} />
    );
};
