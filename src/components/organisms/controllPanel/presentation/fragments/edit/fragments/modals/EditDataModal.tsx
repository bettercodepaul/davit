import { FunctionComponent } from "react";
import { DataForm } from "../forms/DataForm";
import {DavitDraggableModal} from '../../../../../../../atomic/modals';

interface EditDataModalProps {

}

export const EditDataModal: FunctionComponent<EditDataModalProps> = () => {

    return (
        <DavitDraggableModal form={<DataForm />} />
    );
};
