import { FunctionComponent } from "react";
import { DecisionForm } from "../forms/DecisionForm";
import {DavitDraggableModal} from '../../../../../../../atomic/modals';

interface EditDecicionModalProps {

}

export const EditDecisionModal: FunctionComponent<EditDecicionModalProps> = () => {

    return (
        <DavitDraggableModal form={<DecisionForm />} />
    );
};
