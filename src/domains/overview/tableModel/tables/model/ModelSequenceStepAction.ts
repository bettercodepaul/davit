import { useSelector } from "react-redux";
import { DavitIcons } from "../../../../../components/atomic/icons/IconSet";
import { DavitTableRowData } from "../../../../../components/organisms/table/DavitTable";
import { ActorCTO } from "../../../../../dataAccess/access/cto/ActorCTO";
import { DataCTO } from "../../../../../dataAccess/access/cto/DataCTO";
import { SequenceStepCTO } from "../../../../../dataAccess/access/cto/SequenceStepCTO";
import { ActionTO } from "../../../../../dataAccess/access/to/ActionTO";
import { ActionType } from "../../../../../dataAccess/access/types/ActionType";
import { EditActions, editSelectors, Mode } from "../../../../../slices/EditSlice";
import { masterDataSelectors } from "../../../../../slices/MasterDataSlice";
import { SequenceModelActions } from "../../../../../slices/SequenceModelSlice";
import { EditStep } from "../../../../../slices/thunks/StepThunks";
import { useAppDispatch } from "../../../../../store";
import { DavitUtil } from "../../../../../utils/DavitUtil";

export const useGetStepActionTableData = (
    selectedStep: SequenceStepCTO | null,
): { header: string[]; bodyData: DavitTableRowData[] } => {
    const datas: DataCTO[] = useSelector(masterDataSelectors.selectDatas);
    const actors: ActorCTO[] = useSelector(masterDataSelectors.selectActors);
    const actionToEdit: ActionTO | null = useSelector(editSelectors.selectActionToEdit);
    const mode: Mode = useSelector(editSelectors.selectMode);
    const dispatch = useAppDispatch();

    let list: DavitTableRowData[] = [];

    const switchIndexesAndSave = (indexToUpdate: number, step: SequenceStepCTO, increment: boolean) => {
        const newIndex: number = increment ? indexToUpdate + 1 : indexToUpdate - 1;
        const copyStep: SequenceStepCTO = DavitUtil.deepCopy(step);

        const action1: ActionTO = copyStep.actions[indexToUpdate];
        action1.index = newIndex;
        const action2: ActionTO = copyStep.actions[newIndex];
        action2.index = indexToUpdate;
        copyStep.actions[indexToUpdate] = action2;
        copyStep.actions[newIndex] = action1;

        // save step
        dispatch(EditStep.save(copyStep));

        // load sequence from backend
        dispatch(SequenceModelActions.setCurrentSequenceById(copyStep.sequenceStepTO.sequenceFk));

        // update current step if object to edit
        if (mode === Mode.EDIT_SEQUENCE_STEP) {
            dispatch(EditStep.update(copyStep));
        }
    };

    if (selectedStep !== null) {
        list = selectedStep.actions.map((action, index) => {
            const editCallback = () => {
                dispatch(EditActions.setMode.editAction(action));
            };

            const indexIncrementCallback = () => {
                if (index < selectedStep.actions.length - 1) {
                    switchIndexesAndSave(index, selectedStep, true);
                }
            };

            const indexDecrementCallback = () => {
                if (index > 0) {
                    switchIndexesAndSave(index, selectedStep, false);
                }
            };

            const data: DataCTO | undefined = datas.find((data) => data.data.id === action.dataFk);

            let dataName: string = "Could not find data name";

            if (data) {
                dataName = data.data.name;
                if (action.actionType === ActionType.ADD) {
                    dataName =
                        dataName +
                        ": " +
                        data.data.instances.find((instance) => instance.id === action.instanceFk)?.name ||
                        "Could not find instance name";
                }
            }

            const toActorName: string =
                actors.find((actor) => actor.actor.id === action.receivingActorFk)?.actor.name || "";

            const fromActorName: string =
                actors.find((actor) => actor.actor.id === action.sendingActorFk)?.actor.name || "";

            return createModelActionColumn(
                index,
                action.actionType,
                dataName,
                toActorName,
                fromActorName,
                editCallback,
                indexIncrementCallback,
                indexDecrementCallback,
                selectedStep.actions.length,
                action.id === actionToEdit?.id,
            );
        });
    }
    return {
        header,
        bodyData: list,
    };
};

const header = ["INDEX", "TYPE", "DATA", "TARGET", "SOURCE", "ACTIONS"];

const createModelActionColumn = (
    arrayIndex: number,
    actionType: ActionType,
    dataName: string,
    toActorName: string,
    fromActorName: string,
    editCallback: () => void,
    indexIncrementCallback: () => void,
    indexDecrementCallback: () => void,
    arrayLength: number,
    marked?: boolean,
): DavitTableRowData => {
    const actionIndex: string = arrayIndex.toString();
    const trClass = marked ? "carv2TrMarked" : "carv2Tr";

    return {
        data: [actionIndex, actionType, dataName, toActorName, fromActorName],
        trClass,
        actions: [
            {icon: DavitIcons.angleUp, callback: indexDecrementCallback, disable: arrayIndex === 0},
            {icon: DavitIcons.angleDown, callback: indexIncrementCallback, disable: arrayIndex >= arrayLength - 1},
            {icon: DavitIcons.wrench, callback: editCallback},
        ],
    };
};
