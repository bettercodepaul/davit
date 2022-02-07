import React, { FunctionComponent } from "react";
import { DavitDraggableModal } from "../../../../../../../atomic/modals/DavitDraggableModal";
import { ActorForm } from "../forms/ActorForm";

interface EditActorModalProps {

}

export const EditActorModal: FunctionComponent<EditActorModalProps> = () => {

    return (
        <DavitDraggableModal form={<ActorForm />} />
    );
};
