import { FunctionComponent } from "react";
import { DavitModal } from "./DavitModal";
import {DavitDownloadForm} from '../forms';

interface DavitDownloadModalProps {
    closeCallback: () => void;
    visible: boolean;
}

export const DavitDownloadModal: FunctionComponent<DavitDownloadModalProps> = (props) => {
    const {closeCallback, visible} = props;

    return (
        <>
        {visible &&
        <DavitModal>
            <DavitDownloadForm onCloseCallback={closeCallback} />
        </DavitModal>}
        </>
    );
};
