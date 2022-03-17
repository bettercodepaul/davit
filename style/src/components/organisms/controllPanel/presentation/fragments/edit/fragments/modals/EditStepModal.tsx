import React, { FunctionComponent } from "react";
import { DavitDraggableModal } from "../../../../../../../atomic/modals/DavitDraggableModal";
import { StepForm } from "../forms/StepForm";

interface EditStepModalProps {

}

export const EditStepModal: FunctionComponent<EditStepModalProps> = () => {

    return (
        <DavitDraggableModal form={<StepForm />} />
    );
};
