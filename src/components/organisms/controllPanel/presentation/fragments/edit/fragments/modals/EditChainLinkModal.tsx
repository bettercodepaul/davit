import { FunctionComponent } from "react";
import { ChainLinkForm } from "../forms/ChainLinkForm";
import {DavitDraggableModal} from '../../../../../../../atomic/modals';

interface EditChainLinkModalProps {

}

export const EditChainLinkModal: FunctionComponent<EditChainLinkModalProps> = () => {

    return (
        <DavitDraggableModal form={<ChainLinkForm />} />
    );
};
