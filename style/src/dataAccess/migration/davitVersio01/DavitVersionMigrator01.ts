import { DataAndInstanceId } from "../../../components/atomic/dropdowns/InstanceDropDown";
import { DEFAULT_PROJECT_NAME } from "../../../DavitConstants";
import { ActionTO } from "../../access/to/ActionTO";
import { ActorTO } from "../../access/to/ActorTO";
import { ChainDecisionTO } from "../../access/to/ChainDecisionTO";
import { ChainlinkTO } from "../../access/to/ChainlinkTO";
import { ChainTO } from "../../access/to/ChainTO";
import { ConditionTO } from "../../access/to/ConditionTO";
import { DataRelationTO } from "../../access/to/DataRelationTO";
import { DataSetupTO } from "../../access/to/DataSetupTO";
import { DataTO } from "../../access/to/DataTO";
import { DecisionTO } from "../../access/to/DecisionTO";
import { GeometricalDataTO } from "../../access/to/GeometricalDataTO";
import { GroupTO } from "../../access/to/GroupTO";
import { InitDataTO } from "../../access/to/InitDataTO";
import { PositionTO } from "../../access/to/PositionTO";
import { SequenceStepTO } from "../../access/to/SequenceStepTO";
import { SequenceTO } from "../../access/to/SequenceTO";
import { StoreTO } from "../../access/to/StoreTO";
import { DecisionTO02 } from "../davitVersion02/to/DecisionTO02";
import { ActionTO01 } from "./to/ActionTO01";
import { ChainDecisionTO01 } from "./to/ChainDecisionTO01";
import { DataTO01 } from "./to/DataTO01";
import { DecisionTO01 } from "./to/DecisionTO01";
import { StoreTO01 } from "./to/StoreTO01";

export const DavitVersionMigrator01 = {
    migrate(dataStoreObject: StoreTO): StoreTO01 {
        console.info("start migration to version 0.1");
        const version: number = 0.1;
        const projectName: string = DEFAULT_PROJECT_NAME;

        const actions: ActionTO[] = (dataStoreObject.actions as ActionTO01[]).map((action, index) => {
            return {
                id: action.id,
                actionType: action.actionType,
                dataFk: action.dataFk,
                instanceFk: action.instanceFk,
                receivingActorFk: action.receivingActorFk,
                sendingActorFk: action.sendingActorFk,
                sequenceStepFk: action.sequenceStepFk,
                triggerText: "",
                index: index,
            };
        });
        const decisions: DecisionTO02[] = (dataStoreObject.decisions as DecisionTO01[]).map((decision) => {
            const dataAndInstaceIds: DataAndInstanceId[] = [];
            decision.dataAndInstaceId.forEach((dataAndInsanceId) => {
                dataAndInstaceIds.push(dataAndInsanceId);
            });

            return {
                actorFk: decision.actorFk,
                dataAndInstaceIds: dataAndInstaceIds,
                elseGoTo: decision.elseGoTo,
                id: decision.id,
                ifGoTo: decision.ifGoTo,
                name: decision.name,
                root: decision.root,
                sequenceFk: decision.sequenceFk,
            };
        });
        const datas: DataTO[] = (dataStoreObject.datas as DataTO01[]).map((data) => {
            return {
                id: data.id,
                name: data.name,
                geometricalDataFk: data.geometricalDataFk,
                dataConnectionFks: data.dataConnectionFks,
                note: "",
                instances: data.instances.map((instance) => {
                    return {id: instance.id, name: instance.name};
                }),
            };
        });

        const buildConditionFromDataAndInstance = (dataInstanceId: DataAndInstanceId, actorFk: number, decisionFk: number): ConditionTO => {
            return {
                id: -1,
                actorFk: actorFk,
                decisionFk: decisionFk,
                dataFk: dataInstanceId.dataFk,
                instanceFk: dataInstanceId.instanceId
            };
        };

        const chaindecisions: ChainDecisionTO[] = (dataStoreObject.chaindecisions as ChainDecisionTO01[]).map(
            (chainDecision) => {
                return {
                    id: chainDecision.id,
                    name: chainDecision.name,
                    chainFk: chainDecision.chainFk,
                    conditions: chainDecision.dataAndInstaceIds.map(dataInstanceId => buildConditionFromDataAndInstance(dataInstanceId, chainDecision.actorFk, chainDecision.id)),
                    ifGoTo: chainDecision.ifGoTo,
                    elseGoTo: chainDecision.elseGoTo,
                };
            },
        );

        return {
            version: version,
            projectName: projectName,

            actors: dataStoreObject.actors as ActorTO[],
            groups: dataStoreObject.groups as GroupTO[],
            geometricalDatas: dataStoreObject.geometricalDatas as GeometricalDataTO[],
            positions: dataStoreObject.positions as PositionTO[],
            designs: dataStoreObject.designs as DecisionTO[],
            sequences: dataStoreObject.sequences as SequenceTO[],
            steps: dataStoreObject.steps as SequenceStepTO[],
            dataConnections: dataStoreObject.dataConnections as DataRelationTO[],
            initDatas: dataStoreObject.initDatas as InitDataTO[],
            dataSetups: dataStoreObject.dataSetups as DataSetupTO[],
            chains: dataStoreObject.chains as ChainTO[],
            chainlinks: dataStoreObject.chainlinks as ChainlinkTO[],

            actions: actions,
            decisions: decisions,
            datas: datas,
            chaindecisions: chaindecisions,
        };
    },
};
