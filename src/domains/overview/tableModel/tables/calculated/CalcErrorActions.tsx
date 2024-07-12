import { useSelector } from "react-redux";
import { DavitTableRowData } from "../../../../../components/organisms/table/DavitTable";
import { ActorCTO } from "../../../../../dataAccess/access/cto/ActorCTO";
import { DataCTO } from "../../../../../dataAccess/access/cto/DataCTO";
import { ActionTO } from "../../../../../dataAccess/access/to/ActionTO";
import { ActionType } from "../../../../../dataAccess/access/types/ActionType";
import { masterDataSelectors } from "../../../../../slices/MasterDataSlice";

export const useGetCalcErrorActionsTableData = (errorActions: ActionTO[]) => {
    const datas: DataCTO[] = useSelector(masterDataSelectors.selectDatas);
    const actors: ActorCTO[] = useSelector(masterDataSelectors.selectActors);

    const bodyData: DavitTableRowData[] = errorActions.map((action) => {
        const dataName: string = getDataName(action, datas);
        const toActorName: string =
            actors.find((actor) => actor.actor.id === action.receivingActorFk)?.actor.name || "";

        const fromActorName: string =
            actors.find((actor) => actor.actor.id === action.sendingActorFk)?.actor.name || "";

        return createCalcErrorActionColumn(action.actionType, dataName, toActorName, fromActorName);
    });

    return {
        header,
        bodyData,
    };
};

const header = ["TYPE", "DATA", "TARGET", "SOURCE"];

const createCalcErrorActionColumn = (
    actionType: ActionType,
    dataName: string,
    toActorName: string,
    fromActorName: string,
): DavitTableRowData => {
    const trClass = "carv2Tr";

    return {
        data: [actionType, dataName, toActorName, fromActorName],
        trClass,
        actions: [],
    };
};

// ------------------------------------------------ Private ---------------------------------------------------

const getDataName = (action: ActionTO, datas: DataCTO[]): string => {
    const data: DataCTO | undefined = datas.find((data) => data.data.id === action.dataFk);
    let dataName: string = data ? data.data.name : "Could not find Data!";

    if (data !== undefined && action.actionType === ActionType.ADD) {
        dataName =
            dataName + ": " + data.data.instances.find((instance) => instance.id === action.instanceFk)?.name ||
            "Could not find instance!";
    }

    return dataName;
};
