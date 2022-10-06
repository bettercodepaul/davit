import { useDispatch, useSelector } from "react-redux";
import { DavitIcons } from "../../../../../components/atomic/icons/IconSet";
import { DavitTableRowData } from "../../../../../components/organisms/table/DavitTable";
import { ActorCTO } from "../../../../../dataAccess/access/cto/ActorCTO";
import { DataCTO } from "../../../../../dataAccess/access/cto/DataCTO";
import { ConditionTO } from "../../../../../dataAccess/access/to/ConditionTO";
import { DecisionTO } from "../../../../../dataAccess/access/to/DecisionTO";
import { EditActions, editSelectors } from "../../../../../slices/EditSlice";
import { masterDataSelectors } from "../../../../../slices/MasterDataSlice";
import { EditDecision } from "../../../../../slices/thunks/DecisionThunks";
import { useAppDispatch } from "../../../../../store";

export const useGetModelSequenceConditionTableData = (
    decision: DecisionTO | null,
    condition: ConditionTO | null,
): { header: string[]; bodyData: DavitTableRowData[] } => {
    const dispatch = useAppDispatch();

    const conditionToEdit: ConditionTO | null = useSelector(editSelectors.selectConditionToEdit);

    let decisionToShow: DecisionTO | null = decision;

    const actors: ActorCTO[] = useSelector(masterDataSelectors.selectActors);
    const datas: DataCTO[] = useSelector(masterDataSelectors.selectDatas);

    let bodyData: DavitTableRowData[] = [];

    if (condition !== null) {
        decisionToShow = EditDecision.find(condition.decisionFk);
    }

    if (decisionToShow !== null) {
        bodyData = decisionToShow.conditions.map((condition) => {
            const actorName: string =
                actors.find((actor) => actor.actor.id === condition.actorFk)?.actor.name || "Could not find actor";

            const dataCTO: DataCTO | undefined = datas.find((data) => data.data.id === condition.dataFk);

            let dataName: string = "Could not find data";
            let instanceName: string = "Could not find data";

            if (dataCTO) {
                dataName = dataCTO?.data.name || "Could not find data";
                instanceName =
                    dataCTO?.data.instances.find((instance) => instance.id === condition.instanceFk)?.name ||
                    "Could not find instance";
            }

            const onClickEdit = () => dispatch(EditActions.setMode.editCondition(decisionToShow!, condition));

            return createConditionColumn(
                actorName,
                dataName,
                instanceName,
                onClickEdit,
                condition.id === conditionToEdit?.id,
            );
        });
    }

    return {
        header,
        bodyData,
    };
};

const header = ["ACTOR", "DATA", "INSTANCE", "ACTIONS"];

const createConditionColumn = (
    actorName: string,
    dataName: string,
    instanceName: string,
    editCallback: () => void,
    marked?: boolean,
): DavitTableRowData => {
    const trClass = marked ? "carv2TrMarked" : "carv2Tr";
    const editAction = {icon: DavitIcons.wrench, callback: editCallback};

    return {
        trClass,
        data: [actorName, dataName, instanceName],
        actions: [editAction],
    };
};
