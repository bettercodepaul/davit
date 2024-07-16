import { FunctionComponent } from "react";
import { ChainStateForm } from "../forms/ChainStateForm";
import {DavitModal} from '../../../../../../../atomic/modals';

interface EditChainModalProps {
}

export const EditChainStateModal: FunctionComponent<EditChainModalProps> = () => {

    return (
        <DavitModal>
            <ChainStateForm />
        </DavitModal>
    );
};
