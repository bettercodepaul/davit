import React, { FunctionComponent } from "react";
import { PositionTO } from "../../../dataAccess/access/to/PositionTO";
import { DnDBox, DnDBoxType } from "../../organisms/dndBox/DnDBox";
import { DavitModal } from "./DavitModal";

interface DavitDraggableModalProps {
    form: JSX.Element
}

export const DavitDraggableModal: FunctionComponent<DavitDraggableModalProps> = (props) => {
    const {form} = props;

    return (
        <DavitModal>
            <DnDBox
                onPositionUpdate={() => {
                }}
                toDnDElements={[
                    {
                        element: form,
                        position: new PositionTO(30, 10),
                    },
                ]}
                svgElements={[]}
                zoomIn={() => {
                }}
                zoomOut={() => {
                }}
                type={DnDBoxType.fullscreen}
            />
        </DavitModal>
    );
};
