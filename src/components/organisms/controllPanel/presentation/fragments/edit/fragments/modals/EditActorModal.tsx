import { FunctionComponent } from "react";
import { ActorForm } from "../forms/ActorForm";
import {DavitDraggableModal} from '../../../../../../../atomic/modals';

interface EditActorModalProps {

}

export const EditActorModal: FunctionComponent<EditActorModalProps> = () => {

    return (
        <DavitDraggableModal form={<ActorForm />} />
    );
};
