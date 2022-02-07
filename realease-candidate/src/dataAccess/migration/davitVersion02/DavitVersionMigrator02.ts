import { DAVIT_VERISON, DEFAULT_ZOOM } from "../../../DavitConstants";
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
import { StoreTO01 } from "../davitVersio01/to/StoreTO01";
import { DecisionTO02 } from "./to/DecisionTO02";

export const DavitVersionMigrator02 = {
    migrate(dataStoreObject: StoreTO01): StoreTO {
        console.info("start migration to version 0.2");
        const actorZoom: number = DEFAULT_ZOOM;
        const dataZoom: number = DEFAULT_ZOOM;

        const decisions: DecisionTO[] = (dataStoreObject.decisions as DecisionTO02[]).map((decision) => {
            const conditions: ConditionTO[] = [];
            decision.dataAndInstaceIds.forEach((dataAndInsanceId) => {
                conditions.push({
                    decisionFk: decision.id,
                    instanceFk: dataAndInsanceId.instanceId,
                    dataFk: dataAndInsanceId.dataFk,
                    actorFk: decision.actorFk,
                    id: -1,
                });
            });

            return {
                actorFk: decision.actorFk,
                conditions: conditions,
                elseGoTo: decision.elseGoTo,
                id: decision.id,
                ifGoTo: decision.ifGoTo,
                name: decision.name,
                root: decision.root,
                sequenceFk: decision.sequenceFk,
                note: "",
            };
        });

        return {
            version: DAVIT_VERISON,
            projectName: dataStoreObject.projectName,
            actorZoom: actorZoom,
            dataZoom: dataZoom,

            actors: dataStoreObject.actors as ActorTO[],
            groups: dataStoreObject.groups as GroupTO[],
            geometricalDatas: dataStoreObject.geometricalDatas as GeometricalDataTO[],
            positions: dataStoreObject.positions as PositionTO[],
            designs: dataStoreObject.designs as DecisionTO[],
            sequences: dataStoreObject.sequences as SequenceTO[],
            steps: dataStoreObject.steps as SequenceStepTO[],
            actions: dataStoreObject.actions as ActionTO[],
            decisions: decisions,
            datas: dataStoreObject.datas as DataTO[],
            dataConnections: dataStoreObject.dataConnections as DataRelationTO[],
            initDatas: dataStoreObject.initDatas as InitDataTO[],
            dataSetups: dataStoreObject.dataSetups as DataSetupTO[],
            chains: dataStoreObject.chains as ChainTO[],
            chainlinks: dataStoreObject.chainlinks as ChainlinkTO[],
            chaindecisions: dataStoreObject.chaindecisions as ChainDecisionTO[],
        };
    },
};
