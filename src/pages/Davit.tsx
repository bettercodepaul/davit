import {useEffect} from "react";

// import {BrowserRouter, Route, Switch} from "react-router-dom";
// electron needs HashRouter
import {ErrorNotification} from "../components/molecules";
import {ControlPanelController} from "../components/organisms/controllPanel/presentation/ControlPanelController";
import {SidePanelController} from "../components/organisms/sidePanel/SidePanelController";
import "../css/Davit.css";
import {ActorModelController} from "../domains/actor/ActorModelController";
import {DataModelController} from "../domains/datamodel/DataModelController";
import {FlowChartController} from "../domains/overview/flowChartModel/FlowChartController";
import {TableModelController} from "../domains/overview/tableModel/presentation/TableModelController";
import {GlobalActions} from "../slices/GlobalSlice";
import {MasterDataActions} from "../slices/MasterDataSlice";
import {useAppDispatch} from "../store";

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

    return (<div className="davitGridContainer">
        <ControlPanelController/>
        <ActorModelController/>
        <DataModelController/>
        <SidePanelController/>
        <FlowChartController/>
        <TableModelController/>
        <ErrorNotification/>
    </div>);
}
