import { FunctionComponent } from "react";
import { ChainDecisionForm } from "../forms/ChainDecisionForm";
import {DavitDraggableModal} from '../../../../../../../atomic/modals';

interface EditChainDecisionModalProps {

}

export const EditChainDecisionModal: FunctionComponent<EditChainDecisionModalProps> = () => {

    return (
        <DavitDraggableModal form={<ChainDecisionForm />} />
    );
};
