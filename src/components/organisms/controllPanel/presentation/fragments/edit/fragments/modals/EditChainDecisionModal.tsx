import React, { FunctionComponent } from "react";
import { DavitDraggableModal } from "../../../../../../../atomic";
import { ChainDecisionForm } from "../forms/ChainDecisionForm";

interface EditChainDecisionModalProps {

}

export const EditChainDecisionModal: FunctionComponent<EditChainDecisionModalProps> = () => {

    return (
        // eslint-disable-next-line react/jsx-no-undef
        <DavitDraggableModal form={<ChainDecisionForm />} />
    );
};
