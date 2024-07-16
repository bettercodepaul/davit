import { FunctionComponent } from "react";
import { StepForm } from "../forms/StepForm";
import {DavitDraggableModal} from '../../../../../../../atomic/modals';

interface EditStepModalProps {

}

export const EditStepModal: FunctionComponent<EditStepModalProps> = () => {

    return (
        <DavitDraggableModal form={<StepForm />} />
    );
};
