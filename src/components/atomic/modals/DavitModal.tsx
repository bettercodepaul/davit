import React, { FunctionComponent } from "react";
import "./DavitModal.css";

interface DavitModalProps {
}

export const DavitModal: FunctionComponent<DavitModalProps> = (props) => {
    const {children} = props;

    return <div className="davitModal">{children}</div>;
};
