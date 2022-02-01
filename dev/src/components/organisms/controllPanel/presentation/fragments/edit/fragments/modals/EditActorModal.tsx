import React, { FunctionComponent } from "react";
import { DavitDraggableModal } from "../../../../../../../atomic";
import { ActorForm } from "../forms/ActorForm";

interface EditActorModalProps {

}

export const EditActorModal: FunctionComponent<EditActorModalProps> = () => {

    return (
        <DavitDraggableModal form={<ActorForm />} />
    );
};
