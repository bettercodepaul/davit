import { ActionTO } from "../dataAccess/access/to/ActionTO";
import { DecisionTO } from "../dataAccess/access/to/DecisionTO";
import { SequenceStateValue } from "../dataAccess/access/to/SequenceConfigurationTO";
import { SequenceStateTO } from "../dataAccess/access/to/SequenceStateTO";
import { ActionType } from "../dataAccess/access/types/ActionType";
import { GoTo } from "../dataAccess/access/types/GoToType";
import { ActorData } from "../viewDataTypes/ActorData";
import { ActorDataState } from "../viewDataTypes/ActorDataState";

// ----------------------------------------------------- INTERFACES ----------------------------------------------------------

export interface SequenceActionResult {
    actorDatas: ActorData[];
    errors: ActionTO[];
    falseStates: SequenceStateTO[];
    trueStates: SequenceStateTO[];
}

export interface SequenceDecisionResult {
    actorDatas: ActorData[];
    falseStates: SequenceStateTO[];
    trueStates: SequenceStateTO[];
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
        return {actorDatas: newActorDatas, errors: errors, falseStates: [], trueStates: []};
    },

    executeDecisionCheck(
        decision: DecisionTO,
        actorDatas: ActorData[],
        states: SequenceStateTO[],
        stateValues: SequenceStateValue[]
    ): SequenceDecisionResult {
        /**
         * Remove with status "deleted" and "check failed"
         * Change rest to status "persistent".
         * */
        let updatedActorDatas: ActorData[] = actorDatas
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

        const falseStates: SequenceStateTO[] = [];
        const trueStates: SequenceStateTO[] = [];

        const configuredStates: SequenceStateTO[] = states.map(state => {
            stateValues.forEach(stateValue => {
                if(state.id === stateValue.sequenceStateFk){
                    state.isState = stateValue.value;
                }
            });
            return state;
        });

        decision.stateFkAndStateConditions.forEach(stateFkAndStateCondition => {
            const stateToCheck: SequenceStateTO | undefined = configuredStates.find(state => state.id === stateFkAndStateCondition.stateFk);
            if (stateToCheck) {
                if (stateToCheck.isState !== stateFkAndStateCondition.stateCondition) {
                    falseStates.push(stateToCheck);
                    goTo = decision.elseGoTo;
                } else {
                    trueStates.push(stateToCheck);
                }
            }
        });

        return {actorDatas: updatedActorDatas, goto: goTo, falseStates: falseStates, trueStates: trueStates};
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
