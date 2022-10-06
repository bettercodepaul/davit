import { ActionTO } from "../dataAccess/access/to/ActionTO";
import { DecisionTO } from "../dataAccess/access/to/DecisionTO";
import { ActionType } from "../dataAccess/access/types/ActionType";
import { GoTo } from "../dataAccess/access/types/GoToType";
import { ActorData } from "../viewDataTypes/ActorData";
import { ActorDataState } from "../viewDataTypes/ActorDataState";

// ----------------------------------------------------- INTERFACES ----------------------------------------------------------

export interface SequenceActionResult {
    actorDatas: ActorData[];
    errors: ActionTO[];
}

export interface SequenceDecisionResult {
    actorDatas: ActorData[];
    goto: GoTo;
}

// ----------------------------------------------------- PUBLIC FUNCTION -----------------------------------------------------

export const SequenceActionReducer = {
    executeActionsOnActorDatas(actions: ActionTO[], actorDatas: ActorData[]): SequenceActionResult {
        // copy actorDatas and set all to state PERSISTENT
        const newActorDatas: ActorData[] = actorDatas
            .filter((actorData) => !isTransiantState(actorData.state))
            .map((actorData) => {
                return {...actorData, state: ActorDataState.PERSISTENT};
            });
        const errors: ActionTO[] = [];

        actions.forEach((action) => {
            const indexActorDataReceiving: number = findActorDataIndex(
                action.receivingActorFk,
                action.dataFk,
                newActorDatas,
            );

            const indexActorDataSending: number = findActorDataIndex(
                action.sendingActorFk,
                action.dataFk,
                newActorDatas,
            );

            switch (action.actionType) {
                case ActionType.ADD:
                    if (!actorDataIsPresent(indexActorDataReceiving)) {
                        newActorDatas.push({
                            actorFk: action.receivingActorFk,
                            dataFk: action.dataFk,
                            instanceFk: action.instanceFk,
                            state: ActorDataState.NEW,
                        });
                    } else if (newActorDatas[indexActorDataReceiving].instanceFk !== action.instanceFk) {
                        newActorDatas.push({
                            actorFk: action.receivingActorFk,
                            dataFk: action.dataFk,
                            instanceFk: action.instanceFk,
                            state: ActorDataState.UPDATED_TO,
                        });
                        newActorDatas[indexActorDataReceiving] = {
                            ...newActorDatas[indexActorDataReceiving],
                            state: ActorDataState.UPDATED_FROM,
                        };
                    } else {
                        errors.push(action);
                    }
                    break;
                case ActionType.DELETE:
                    actorDataIsPresent(indexActorDataReceiving)
                        ? (newActorDatas[indexActorDataReceiving].state = ActorDataState.DELETED)
                        : errors.push(action);
                    break;
                case ActionType.SEND:
                    if (actorDataIsPresent(indexActorDataSending)) {
                        const actorData: ActorData = {
                            actorFk: action.receivingActorFk,
                            dataFk: action.dataFk,
                            instanceFk: newActorDatas[indexActorDataSending].instanceFk,
                            state: ActorDataState.SENT,
                        };
                        newActorDatas[indexActorDataSending].state = ActorDataState.SENT;
                        if (actorDataIsPresent(indexActorDataReceiving)) {
                            newActorDatas.push({
                                actorFk: action.receivingActorFk,
                                dataFk: action.dataFk,
                                instanceFk: newActorDatas[indexActorDataReceiving].instanceFk,
                                state: ActorDataState.UPDATED_FROM,
                            });
                            newActorDatas[indexActorDataReceiving] = {...actorData, state: ActorDataState.UPDATED_TO};
                        } else {
                            newActorDatas.push(actorData);
                        }
                    } else {
                        errors.push(action);
                    }
                    break;
                case ActionType.SEND_AND_DELETE:
                    if (actorDataIsPresent(indexActorDataSending)) {
                        const actorData: ActorData = {
                            actorFk: action.receivingActorFk,
                            dataFk: action.dataFk,
                            instanceFk: newActorDatas[indexActorDataSending].instanceFk,
                            state: ActorDataState.SENT,
                        };
                        newActorDatas[indexActorDataSending].state = ActorDataState.DELETED;
                        if (actorDataIsPresent(indexActorDataReceiving)) {
                            newActorDatas[indexActorDataReceiving] = {...actorData, state: ActorDataState.UPDATED_TO};
                        } else {
                            newActorDatas.push(actorData);
                        }
                    } else {
                        errors.push(action);
                    }
                    break;
            }
        });
        return {actorDatas: newActorDatas, errors};
    },

    executeDecisionCheck(decision: DecisionTO, actorDatas: ActorData[]): SequenceDecisionResult {
        /**
         * Remove with status "deleted" and "check failed"
         * Change rest to status "persistent".
         * */
        const updatedActorDatas: ActorData[] = actorDatas
            .filter((actorData) => !isTransiantState(actorData.state))
            .map((actorData) => {
                return {...actorData, state: ActorDataState.PERSISTENT};
            });

        let goTo = decision.ifGoTo;

        decision.conditions.forEach((condition) => {
            const actorDataToCheck: ActorData | undefined = updatedActorDatas.find(
                (actorData) => actorData.actorFk === condition.actorFk && actorData.dataFk === condition.dataFk && actorData.instanceFk === condition.instanceFk,
            );

            if (actorDataToCheck) {
                actorDataToCheck.state = ActorDataState.CHECKED;
            } else {
                updatedActorDatas.push({
                    actorFk: condition.actorFk,
                    dataFk: condition.dataFk,
                    instanceFk: condition.instanceFk,
                    state: ActorDataState.CHECK_FAILED,
                });
                goTo = decision.elseGoTo;
            }
        });

        return {actorDatas: updatedActorDatas, goto: goTo};
    },
};

// ------------------------------------------------------------ PRIVATE FUNCTIONS ------------------------------------------------------------

const findActorDataIndex = (actorId: number, dataId: number, actorDatas: ActorData[]): number => {
    return actorDatas.findIndex(
        (actorData) =>
            actorData.actorFk === actorId && actorData.dataFk === dataId && !isTransiantState(actorData.state),
    );
};

const isTransiantState = (state: ActorDataState) => {
    return (
        state === ActorDataState.DELETED ||
        state === ActorDataState.UPDATED_FROM ||
        state === ActorDataState.CHECK_FAILED
    );
};

function actorDataIsPresent(indexActorDataToEdit: number) {
    return indexActorDataToEdit !== -1;
}
