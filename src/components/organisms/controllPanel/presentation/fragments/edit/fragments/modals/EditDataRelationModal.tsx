import { FunctionComponent } from "react";
import { DataRelationForm } from "../forms/DataRelationForm";
import {DavitDraggableModal} from '../../../../../../../atomic/modals';

interface EditDataRelationModalProps {

}

export const EditDataRelationModal: FunctionComponent<EditDataRelationModalProps> = () => {

    return (
        <DavitDraggableModal form={<DataRelationForm />} />
    );
};
