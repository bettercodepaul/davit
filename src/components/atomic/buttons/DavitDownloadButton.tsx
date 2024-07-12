import { faDownload } from "@fortawesome/free-solid-svg-icons";
import React, { FunctionComponent, useState } from "react";
import { DavitIconButton } from ".";
import { DavitDownloadModal } from "../modals";

export interface DavitDownloadButtonProps {
}

export const DavitDownloadButton: FunctionComponent<DavitDownloadButtonProps> = () => {
    const [showForm, setShowForm] = useState<boolean>(false);

    return (
        <>
            <DavitIconButton onClick={() => setShowForm(true)}
                         iconName={faDownload}
            />
            {showForm && <DavitDownloadModal closeCallback={() => setShowForm(false)} />}
        </>
    );
};
