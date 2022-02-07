import { faShare } from "@fortawesome/free-solid-svg-icons";
import React, { FunctionComponent } from "react";
import { ModuleRoutes } from "../../../../../../pages/Davit";
import { DavitButton } from "../../../../../atomic/buttons/DavitButton";
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
                <DavitButton iconName={faShare}
                             onClick={showActorPage}
                />
                <DavitButton iconName={faShare}
                             onClick={showDataPage}
                />
                <DavitButton iconName={faShare}
                             onClick={showTablePage}
                />
                <DavitButton iconName={faShare}
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
