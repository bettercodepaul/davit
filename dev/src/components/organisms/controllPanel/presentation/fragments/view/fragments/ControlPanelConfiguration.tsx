import React, { FunctionComponent } from "react";
import { ConfigurationPanel } from "../../../../../configurationPanel/Configuration";
import { ControlPanel } from "../../edit/common/ControlPanel";

export interface ControlPanelConfigurationProps {

}

export const ControlPanelConfiguration: FunctionComponent<ControlPanelConfigurationProps> = () => {

    return (
        <ControlPanel>
            <ConfigurationPanel />
        </ControlPanel>
    );
};
