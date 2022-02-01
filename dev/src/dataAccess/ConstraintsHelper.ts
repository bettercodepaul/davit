import { DataStoreCTO } from "./access/cto/DataStoreCTO";
import { ActionTO } from "./access/to/ActionTO";
import { DecisionTO } from "./access/to/DecisionTO";
import { SequenceStepTO } from "./access/to/SequenceStepTO";
import { GoToTypes } from "./access/types/GoToType";

export const ConstraintsHelper = {

    deleteSequenceStateConstraintCheck(sequenceStateId: number, dataStore: DataStoreCTO) {
        const decisionIsUsingSequenceState: boolean = Array.from(dataStore.decisions.values())
            .some(decision => decision.stateFkAndStateConditions.some(stateFkAndCondition => stateFkAndCondition.stateFk === sequenceStateId));
        if (decisionIsUsingSequenceState) {
            throw new Error(`Sequence state.error! state with id: ${sequenceStateId} is still connected to decisions(s)!`);
        }
    },

    deleteChainStateConstraintCheck(chainStateId: number, dataStore: DataStoreCTO) {
        const decisionIsUsingChainState: boolean = Array.from(dataStore.chainDecisions.values())
            .some(decision => decision.stateFkAndStateConditions.some(stateFkAndCondition => stateFkAndCondition.stateFk === chainStateId));
        if (decisionIsUsingChainState) {
            throw new Error(`Sequence state.error! state with id: ${chainStateId} is still connected to decisions(s)!`);
        }
    },

    deleteDataConstraintCheck(dataId: number, dataStore: DataStoreCTO) {
        const dataRelationExists: boolean = Array.from(dataStore.dataConnections.values()).some(
            (relation) => relation.data1Fk === dataId || relation.data2Fk === dataId,
        );

        const actionExist: boolean = Array.from(dataStore.actions.values()).some(
            (actorData) => actorData.dataFk === dataId,
        );

        const decisionExists: boolean = Array.from(dataStore.decisions.values()).some((decision) =>
            decision.conditions.some((condition) => condition.dataFk === dataId),
        );

        const chainDecisionExists: boolean = Array.from(dataStore.chainDecisions.values()).some((chainDecision) =>
            chainDecision.conditions.some((condition) => condition.dataFk === dataId),
        );

        if (dataRelationExists || actionExist || decisionExists || chainDecisionExists) {
            throw new Error(`delete.error! data with id: ${dataId} is still connected to Object(s)!`);
        }
    },

    deleteDataInstanceConstraintCheck(dataId: number, instanceId: number, dataStore: DataStoreCTO) {
        const actionExists: boolean = Array.from(dataStore.actions.values()).some(
            (action) => action.dataFk === dataId && action.instanceFk === instanceId,
        );

        const decisionExists: boolean = Array.from(dataStore.decisions.values()).some((decision) =>
            decision.conditions.some((condition) => condition.dataFk === dataId && condition.instanceFk === instanceId),
        );

        const chainDecisionExists: boolean = Array.from(dataStore.chainDecisions.values()).some((chainDecision) =>
            chainDecision.conditions.some(
                (condition) => condition.dataFk === dataId && condition.instanceFk === instanceId,
            ),
        );

        if (actionExists || decisionExists || chainDecisionExists) {
            throw new Error(`delete.error! data instance with id: ${instanceId} is still connected to Object(s)!`);
        }
    },

    deleteActorConstraintCheck(actorId: number, dataStore: DataStoreCTO) {
        const actionExists: boolean = Array.from(dataStore.actions.values()).some(
            (action) => action.sendingActorFk === actorId || action.receivingActorFk === actorId,
        );

        const decisionExists: boolean = Array.from(dataStore.decisions.values()).some((decision) =>
            decision.conditions.some((condition) => condition.actorFk === actorId),
        );

        const chainDecisionExists: boolean = Array.from(dataStore.chainDecisions.values()).some(
            (chainDecision) => chainDecision.conditions.some(condition => condition.actorFk === actorId),
        );

        if (actionExists || decisionExists || chainDecisionExists) {
            throw new Error(`delete.error! actor with id: ${actorId} is still connected to Object(s)!`);
        }
    },

    deleteStepConstraintCheck(stepToDelete: SequenceStepTO, dataStore: DataStoreCTO) {
        let errorMessagePrefix: string = `delete.error! step: ${stepToDelete.name} with id: ${stepToDelete.id} is still connected to: \n`;
        let errorMessageSuffix: string = "";

        const constraintStep: SequenceStepTO | undefined = Array.from(dataStore.steps.values()).find(
            (step) => step.goto.type === GoToTypes.STEP && step.goto.id === stepToDelete.id,
        );

        errorMessageSuffix =
            errorMessageSuffix + (constraintStep ? `step: ${constraintStep.name} with id: ${constraintStep.id}!` : "");

        const constraintAction: ActionTO | undefined = Array.from(dataStore.actions.values()).find(
            (action) => action.sequenceStepFk === stepToDelete.id,
        );

        errorMessageSuffix =
            errorMessageSuffix +
            (constraintAction ? `\n action: ${constraintAction.actionType} with id: ${constraintAction.id}!` : "");

        const constraintDecision: DecisionTO | undefined = Array.from(dataStore.decisions.values()).find(
            (decision) =>
                (decision.ifGoTo.type === GoToTypes.STEP && decision.ifGoTo.id === stepToDelete.id) ||
                (decision.elseGoTo.type === GoToTypes.STEP && decision.elseGoTo.id === stepToDelete.id),
        );

        errorMessageSuffix =
            errorMessageSuffix +
            (constraintDecision ? `\n decision: ${constraintDecision.name} with id: ${constraintDecision.id}!` : "");

        if (errorMessageSuffix.length > 0) {
            throw new Error(errorMessagePrefix + errorMessageSuffix);
        }
    },

    deleteSequenceConstraintCheck(sequenceId: number, dataStore: DataStoreCTO) {
        const stepExists: boolean = Array.from(dataStore.steps.values()).some((step) => step.sequenceFk === sequenceId);

        const decisionExists: boolean = Array.from(dataStore.decisions.values()).some(
            (dec) => dec.sequenceFk === sequenceId,
        );
        if (stepExists || decisionExists) {
            throw new Error(`delete.error! sequence: ${sequenceId} is still connected to step(s) or decision(s)!`);
        }
    },

    deleteChainConstraintCheck(chainId: number, dataStore: DataStoreCTO) {
        const linkExists: boolean = Array.from(dataStore.chainLinks.values()).some(
            (chainlink) => chainlink.chainFk === chainId,
        );

        const chainDecisionExists: boolean = Array.from(dataStore.chainDecisions.values()).some(
            (chainDecision) => chainDecision.chainFk === chainId,
        );

        if (linkExists || chainDecisionExists) {
            throw new Error(`delete.error! chain: ${chainId} is still connected to link(s) or chain decision(s)!`);
        }
    },

    deleteGeometricalDataConstraintCheck(geometDataId: number, dataStore: DataStoreCTO) {
        const actorExists: boolean = Array.from(dataStore.actors.values()).some(
            (actor) => actor.geometricalDataFk === geometDataId,
        );
        const dataExists: boolean = Array.from(dataStore.datas.values()).some(
            (data) => data.geometricalDataFk === geometDataId,
        );
        if (actorExists || dataExists) {
            throw new Error(`delete.error! geometrical data with id: ${geometDataId} is still connected to Object(s)!`);
        }
    },

    deletePositionConstraintCheck(positionId: number, dataStore: DataStoreCTO) {
        const geometricalDataExists: boolean = Array.from(dataStore.geometricalDatas.values()).some(
            (geoData) => geoData.positionFk === positionId,
        );
        if (geometricalDataExists) {
            throw new Error(`delete.error! position with id: ${positionId} is still connected to GeometricalData(s)!`);
        }
    },

    deleteDesignConstraintCheck(designId: number, dataStore: DataStoreCTO) {
        const actorExists: boolean = Array.from(dataStore.actors.values()).some((actor) => actor.designFk === designId);
        if (actorExists) {
            throw new Error(`delete.error! design with id: ${designId} is still connected to Actor(s)!`);
        }
    },

    deleteGroupConstraintCheck(groupId: number, dataStore: DataStoreCTO) {
        const actorExists: boolean = Array.from(dataStore.actors.values()).some((actor) => actor.groupFks === groupId);
        if (actorExists) {
            throw new Error(`delete.error! group with id: ${groupId} is still connected to Actor(s)!`);
        }
    },
};
