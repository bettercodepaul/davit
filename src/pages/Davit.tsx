import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

// import {BrowserRouter, Route, Switch} from "react-router-dom";
// electron needs HashRouter
import { HashRouter as BrowserRouter, Route, Routes } from "react-router-dom";
import { ErrorNotification } from "../components/molecules/notifications/ErrorNotification";
import { ControlPanelController } from "../components/organisms/controllPanel/presentation/ControlPanelController";
import { SidePanelController } from "../components/organisms/sidePanel/SidePanelController";
import "../css/Davit.css";
import { ActorModelController } from "../domains/actor/ActorModelController";
import { DataModelController } from "../domains/datamodel/DataModelController";
import { FlowChartController } from "../domains/overview/flowChartModel/FlowChartController";
import { TableModelController } from "../domains/overview/tableModel/presentation/TableModelController";
import { GlobalActions } from "../slices/GlobalSlice";
import { MasterDataActions } from "../slices/MasterDataSlice";
import { useAppDispatch } from "../store";

export const ModuleRoutes = {
    home: "/",
    actor: "/component",
    data: "/data",
    table: "/table",
    flowChart: "/flowChart",
};

// inital data load from backend.
export function Davit() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(MasterDataActions.loadAll());
        dispatch(GlobalActions.loadActorZoomFromBackend());
        dispatch(GlobalActions.loadDataZoomFromBackend());
    }, [dispatch]);

    return (
        <BrowserRouter>
            <Routes>
                <Route 
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
                <Route 
                       path={ModuleRoutes.actor}
                >
                    <div className="Carv2">
                        <div className="componentPage">
                            <ActorModelController fullScreen />
                        </div>
                    </div>
                </Route>
                <Route 
                       path={ModuleRoutes.data}
                >
                    <div className="Carv2">
                        <div className="componentPage">
                            <DataModelController fullScreen />
                        </div>
                    </div>
                </Route>
                <Route 
                       path={ModuleRoutes.table}
                >
                    <div className="Carv2">
                        <div className="componentPage">
                            <TableModelController fullScreen />
                        </div>
                    </div>
                </Route>
                <Route 
                       path={ModuleRoutes.flowChart}
                >
                    <div className="Carv2">
                        <div className="componentPage">
                            <FlowChartController fullScreen />
                        </div>
                    </div>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
