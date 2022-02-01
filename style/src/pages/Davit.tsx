import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { HashRouter as BrowserRouter, Route, Switch } from "react-router-dom";
import { ErrorNotification } from "../components/molecules/notifications/ErrorNotification";
import { ControlPanelController } from "../components/organisms/controllPanel/presentation/ControlPanelController";
import { SidePanelController } from "../components/organisms/sidePanel/SidePanelController";
import { ActorModelController } from "../domains/actor/ActorModelController";
import { DataModelController } from "../domains/datamodel/DataModelController";
import { FlowChartController } from "../domains/overview/flowChartModel/FlowChartController";
import { TableModelController } from "../domains/overview/tableModel/presentation/TableModelController";
import { GlobalActions } from "../slices/GlobalSlice";
import { MasterDataActions } from "../slices/MasterDataSlice";
import "./Davit.css";

export const ModuleRoutes = {
    home: "/",
    actor: "/component",
    data: "/data",
    table: "/table",
    flowChart: "/flowChart",
};

// inital data load from backend.
export function Davit() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(MasterDataActions.loadAll());
        dispatch(GlobalActions.loadActorZoomFromBackend());
        dispatch(GlobalActions.loadDataZoomFromBackend());
    }, [dispatch]);

    return (
        <BrowserRouter>
            <Switch>
                <Route exact
                       path={ModuleRoutes.home}
                >
                    <div className="davitGridContainer">
                        <ControlPanelController />
                        <ActorModelController />
                        <DataModelController />
                        <SidePanelController />
                        <FlowChartController />
                        <TableModelController />
                        <ErrorNotification />
                    </div>
                </Route>
                <Route exact
                       path={ModuleRoutes.actor}
                >
                    <div className="componentPage">
                        <ActorModelController />
                    </div>
                </Route>
                <Route exact
                       path={ModuleRoutes.data}
                >
                    <div className="componentPage">
                        <DataModelController />
                    </div>
                </Route>
                <Route exact
                       path={ModuleRoutes.table}
                >
                    <div className="componentPage">
                        <TableModelController />
                    </div>
                </Route>
                <Route exact
                       path={ModuleRoutes.flowChart}
                >
                    <div className="componentPage">
                        <FlowChartController />
                    </div>
                </Route>
            </Switch>
        </BrowserRouter>
    );
}
