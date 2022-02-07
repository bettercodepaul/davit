import React, { FunctionComponent } from "react";
import { DavitDraggableModal } from "../../../../../../../atomic/modals/DavitDraggableModal";
import { DataForm } from "../forms/DataForm";

interface EditDataModalProps {

}

export const EditDataModal: FunctionComponent<EditDataModalProps> = () => {

    return (
        <DavitDraggableModal form={<DataForm />} />
    );
};
