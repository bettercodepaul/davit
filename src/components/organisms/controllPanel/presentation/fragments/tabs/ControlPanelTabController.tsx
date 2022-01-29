import { faShare } from "@fortawesome/free-solid-svg-icons";
import React, { FunctionComponent } from "react";
import { ModuleRoutes } from "../../../../../../pages/Davit";
import { DavitIconButton } from "../../../../../atomic";
import { ControlPanel } from "../edit/common/ControlPanel";
import { OptionField } from "../edit/common/OptionField";

export interface ControlPanelTabControllerProps {
    hidden: boolean;
}

export const ControlPanelTabController: FunctionComponent<ControlPanelTabControllerProps> = () => {

    const {showActorPage, showDataPage, showFlowChartPage, showTablePage} = useFileOptionModelView();

    return (
        <ControlPanel>
            <OptionField>
                <DavitIconButton iconName={faShare}
                                 onClick={showActorPage}
                />
                <DavitIconButton iconName={faShare}
                                 onClick={showDataPage}
                />
                <DavitIconButton iconName={faShare}
                                 onClick={showTablePage}
                />
                <DavitIconButton iconName={faShare}
                                 onClick={showFlowChartPage}
                />
            </OptionField>
        </ControlPanel>
    );
};

const useFileOptionModelView = () => {
    const showActorPage = () => {
        window.open(ModuleRoutes.actor, "_blank", "toolbar=no,top=0,left=0");
    };
    const showDataPage = () => {
        window.open(ModuleRoutes.data, "_blank", "toolbar=no,top=0,left=0");
    };
    const showTablePage = () => {
        window.open(ModuleRoutes.table, "_blank", "toolbar=no,top=0,left=0");
    };
    const showFlowChartPage = () => {
        window.open(ModuleRoutes.flowChart, "_blank", "toolbar=no,top=0,left=0");
    };

    return {showActorPage, showDataPage, showTablePage, showFlowChartPage};
};
