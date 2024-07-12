import { SequenceCTO } from "../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../dataAccess/access/cto/SequenceStepCTO";
import { ActionTO } from "../dataAccess/access/to/ActionTO";
import { DecisionTO } from "../dataAccess/access/to/DecisionTO";
import { SequenceConfigurationTO } from "../dataAccess/access/to/SequenceConfigurationTO";
import { SequenceStateTO } from "../dataAccess/access/to/SequenceStateTO";
import { ActionType } from "../dataAccess/access/types/ActionType";
import { GoTo, GoToTypes, Terminal } from "../dataAccess/access/types/GoToType";
import { SequenceActionReducer, SequenceActionResult, SequenceDecisionResult } from "../reducer/SequenceActionReducer";
import { DavitUtil } from "../utils/DavitUtil";
import { ActorData } from "../viewDataTypes/ActorData";

// ----------------------------------------------------- INTERFACES ----------------------------------------------------
export interface CalculatedStep {
    type: "STEP" | "DECISION" | "INIT" | "TERMINAL";
    modelElementFk?: number;
    stepId: string;
    actorDatas: ActorData[];
    errors: ActionTO[];
    falseStates: SequenceStateTO[];
    trueStates: SequenceStateTO[];
}

export interface CalcSequence {
    sequenceModel: SequenceCTO | null;
    stepIds: string[];
    calculatedSteps: CalculatedStep[];
    terminal: Terminal;
    loopStartingStepIndex?: number;
}

// ----------------------------------------------------- PUBLIC FUNCTION -----------------------------------------------

export const SequenceService = {
    calculateSequence: (
        sequence: SequenceCTO | null,
        configuration: SequenceConfigurationTO,
        persistentDatas?: ActorData[],
    ): CalcSequence => {
        const calcSequence: CalcSequence = {
            sequenceModel: sequence,
            stepIds: [],
            calculatedSteps: [],
            terminal: {type: GoToTypes.ERROR},
        };
        const stepIds: string[] = [];
        let loopStartingStep: number = -1;

        /**  Start calculation if sequence and data setup are selected */
        if (sequence && configuration) {
            /** Execute data setup */
            const dataSetupActions: ActionTO[] = configuration.initDatas.map((data, index) => {
                return {
                    actionType: ActionType.ADD,
                    receivingActorFk: data.actorFk,
                    dataFk: data.dataFk,
                    instanceFk: data.instanceFk,
                    id: -1,
                    sequenceStepFk: -1,
                    sendingActorFk: -1,
                    triggerText: "",
                    index: index,
                };
            });

            const dataSetupResult: SequenceActionResult = SequenceActionReducer.executeActionsOnActorDatas(
                dataSetupActions,
                persistentDatas || [],
            );

            calcSequence.calculatedSteps.push(getInitStep(dataSetupResult));
            let actorDatas: ActorData[] = DavitUtil.deepCopy(dataSetupResult.actorDatas);

            /** Find root and start calculating sequence */
            const root: SequenceStepCTO | DecisionTO | undefined = getRoot(sequence);

            if (root !== undefined) {
                let stepOrDecision: SequenceStepCTO | DecisionTO | Terminal = root;
                let type = getType(stepOrDecision);
                let stepId: string = "root";

                // calc next step or decision if not looping.
                while (!isLooping(loopStartingStep) && (type === GoToTypes.STEP || type === GoToTypes.DEC)) {
                    // calc next step.
                    if (type === GoToTypes.STEP) {
                        const step: SequenceStepCTO = stepOrDecision as SequenceStepCTO;
                        const result: SequenceActionResult = calculateStep(step, actorDatas);
                        actorDatas = result.actorDatas;

                        loopStartingStep = checkForLoop(calcSequence, step, result);

                        const newStepId = "_STEP_" + step.sequenceStepTO.id;
                        stepId = stepId + newStepId;
                        stepIds.push(stepId);

                        calcSequence.calculatedSteps.push({
                            stepId: stepId,
                            actorDatas: actorDatas,
                            errors: result.errors,
                            modelElementFk: step.sequenceStepTO.id,
                            type: "STEP",
                            falseStates: result.falseStates,
                            trueStates: result.trueStates,
                        });

                        if (!isLooping(loopStartingStep)) {
                            // set next object.
                            stepOrDecision = getNext((stepOrDecision as SequenceStepCTO).sequenceStepTO.goto, sequence);
                            type = getType(stepOrDecision);
                        }
                    }

                    // calc next decision
                    if (type === GoToTypes.DEC) {
                        const decision: DecisionTO = stepOrDecision as DecisionTO;

                        const result: SequenceDecisionResult = SequenceActionReducer.executeDecisionCheck(
                            decision,
                            actorDatas,
                            sequence.sequenceStates,
                            configuration.stateValues,
                        );
                        actorDatas = result.actorDatas;

                        stepOrDecision = getNext(result.goto, sequence);
                        type = getType(stepOrDecision);

                        const newCondID = "_DEC_" + decision.id;
                        stepId = stepId + newCondID;
                        stepIds.push(stepId);

                        calcSequence.calculatedSteps.push({
                            stepId: stepId,
                            actorDatas: actorDatas,
                            errors: [],
                            modelElementFk: decision.id,
                            type: "DECISION",
                            falseStates: result.falseStates,
                            trueStates: result.trueStates,
                        });
                    }
                }
                if (!isLooping(loopStartingStep)) {
                    calcSequence.terminal = stepOrDecision as Terminal;
                    const terminalResult: SequenceActionResult = SequenceActionReducer.executeActionsOnActorDatas(
                        [],
                        actorDatas,
                    );
                    calcSequence.calculatedSteps.push({
                        stepId: stepId + "_" + (stepOrDecision as Terminal).type,
                        actorDatas: terminalResult.actorDatas,
                        type: "TERMINAL",
                        errors: terminalResult.errors,
                        falseStates: terminalResult.falseStates,
                        trueStates: terminalResult.trueStates,
                    });

                    stepIds.push(stepId + "_" + (stepOrDecision as Terminal).type);
                }
            }
        }
        return {
            ...calcSequence,
            stepIds: stepIds,
            loopStartingStepIndex: isLooping(loopStartingStep) ? loopStartingStep : undefined,
        };
    },
};

// ------------------------------------------ PRIVATE FUNCTIONS --------------------------------------

const getInitStep = (result: SequenceActionResult): CalculatedStep => {
    return {
        stepId: "root",
        actorDatas: result.actorDatas,
        type: "INIT",
        errors: result.errors,
        falseStates: result.falseStates,
        trueStates: result.trueStates,
    };
};

const getStepFromSequence = (stepId: number, sequence: SequenceCTO): SequenceStepCTO | undefined => {
    return sequence.sequenceStepCTOs.find((step) => step.sequenceStepTO.id === stepId);
};

const getDecisionFromSequence = (id: number, sequence: SequenceCTO): DecisionTO | undefined => {
    return sequence.decisions.find((cond) => cond.id === id);
};

const getRoot = (sequence: SequenceCTO): SequenceStepCTO | DecisionTO | undefined => {
    const step: SequenceStepCTO | undefined = sequence.sequenceStepCTOs.find((step) => step.sequenceStepTO.root);
    const cond: DecisionTO | undefined = sequence.decisions.find((cond) => cond.root);
    return step ? step : cond ? cond : undefined;
};

const getNext = (goTo: GoTo, sequence: SequenceCTO): SequenceStepCTO | DecisionTO | Terminal => {
    let nextStepOrDecisionOrTerminal: SequenceStepCTO | DecisionTO | Terminal;
    switch (goTo.type) {
        case GoToTypes.STEP:
            nextStepOrDecisionOrTerminal = getStepFromSequence(goTo.id, sequence) || {type: GoToTypes.ERROR};
            break;
        case GoToTypes.DEC:
            nextStepOrDecisionOrTerminal = getDecisionFromSequence(goTo.id, sequence) || {type: GoToTypes.ERROR};
            break;
        case GoToTypes.FIN:
            nextStepOrDecisionOrTerminal = {type: GoToTypes.FIN};
            break;
        case GoToTypes.IDLE:
            nextStepOrDecisionOrTerminal = {type: GoToTypes.IDLE};
            break;
        default:
            nextStepOrDecisionOrTerminal = {type: GoToTypes.ERROR};
    }
    return nextStepOrDecisionOrTerminal;
};

const calculateStep = (step: SequenceStepCTO, actorDatas: ActorData[]): SequenceActionResult => {
    return SequenceActionReducer.executeActionsOnActorDatas(step.actions, actorDatas);
};

const getType = (stepOrDecisionOrTerminal: SequenceStepCTO | DecisionTO | Terminal): GoToTypes => {
    if ((stepOrDecisionOrTerminal as SequenceStepCTO).sequenceStepTO) {
        return GoToTypes.STEP;
    } else if ((stepOrDecisionOrTerminal as DecisionTO).elseGoTo) {
        return GoToTypes.DEC;
    } else if ((stepOrDecisionOrTerminal as Terminal).type) {
        return (stepOrDecisionOrTerminal as Terminal).type;
    } else {
        throw Error("Illegal Type in Sequence");
    }
};

const checkForLoop = (calcSequence: CalcSequence, step: SequenceStepCTO, result: SequenceActionResult): number => {
    return calcSequence.calculatedSteps.findIndex(
        (calcStep) =>
            calcStep.modelElementFk === step.sequenceStepTO.id &&
            calcStep.actorDatas.length === result.actorDatas.length &&
            !calcStep.actorDatas.some(
                (cp) => !result.actorDatas.some((rcp) => rcp.actorFk === cp.actorFk && rcp.dataFk === cp.dataFk),
            ),
    );
};

const isLooping = (loopStartingStep: number) => {
    return loopStartingStep > -1;
};
