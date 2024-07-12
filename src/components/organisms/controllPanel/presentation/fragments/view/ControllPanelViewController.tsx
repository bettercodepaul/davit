import React, { FunctionComponent } from "react";
import { Mode } from "../../../../../../slices/EditSlice";
import { ControlPanelCalculationView } from "./fragments/ControlPanelCalculationView";
import { ControlPanelConfiguration } from "./fragments/ControlPanelConfiguration";

export interface ControlPanelViewControllerProps {
    mode: Mode;
}

export const ControlPanelViewController: FunctionComponent<ControlPanelViewControllerProps> = (props) => {

    const {mode} = props;

    const getViewByMode = (mode: Mode) => {
        switch (mode) {
            case Mode.VIEW_CONFIGURATION:
                return <ControlPanelConfiguration />;
            case Mode.VIEW:
                return <ControlPanelCalculationView />;
            default:
                return <ControlPanelConfiguration />;
        }
    };

    return (getViewByMode(mode));
};
