import React, { FunctionComponent } from "react";
import { DavitDraggableModal } from "../../../../../../../atomic";
import { DataRelationForm } from "../forms/DataRelationForm";

interface EditDataRelationModalProps {

}

export const EditDataRelationModal: FunctionComponent<EditDataRelationModalProps> = () => {

    return (
        <DavitDraggableModal form={<DataRelationForm />} />
    );
};
