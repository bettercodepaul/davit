import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons/faArrowRight";
import { faFastBackward } from "@fortawesome/free-solid-svg-icons/faFastBackward";
import { faFastForward } from "@fortawesome/free-solid-svg-icons/faFastForward";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FunctionComponent } from "react";
import { DavitButton, DavitIconButton } from "../../../../../../atomic";

interface ViewNavigatorProps {
    fastBackward: () => void,
    fastForward: () => void,
    backward: () => void,
    forward: () => void,
    index: string,
}

export const ViewNavigator: FunctionComponent<ViewNavigatorProps> = (props) => {
    const {fastBackward, fastForward, backward, forward, index} = props;

    return (
        <div className="flex">
            <DavitIconButton
                iconName={faFastBackward}
                onClick={fastBackward}
            />
            <DavitButton onClick={backward}>
                <FontAwesomeIcon icon={faArrowLeft} />
                {"BACK"}
            </DavitButton>
            <div className={"border border-medium border-radius flex flex-center padding-small"}>
                <label>{index}</label>
            </div>
            <DavitIconButton onClick={forward}>
                {"NEXT"}
                <FontAwesomeIcon icon={faArrowRight} />
            </DavitIconButton>
            <DavitIconButton
                iconName={faFastForward}
                onClick={fastForward}
            />
        </div>
    );
};
