import { DAVIT_VERISON, DEFAULT_PROJECT_NAME, DEFAULT_ZOOM } from "../../../DavitConstants";
import { ActionTO } from "../to/ActionTO";
import { ActorTO } from "../to/ActorTO";
import { ChainConfigurationTO } from "../to/ChainConfigurationTO";
import { ChainDecisionTO } from "../to/ChainDecisionTO";
import { ChainLinkTO } from "../to/ChainLinkTO";
import { ChainStateTO } from "../to/ChainStateTO";
import { ChainTO } from "../to/ChainTO";
import { DataRelationTO } from "../to/DataRelationTO";
import { DataTO } from "../to/DataTO";
import { DecisionTO } from "../to/DecisionTO";
import { DesignTO } from "../to/DesignTO";
import { GeometricalDataTO } from "../to/GeometricalDataTO";
import { GroupTO } from "../to/GroupTO";
import { PositionTO } from "../to/PositionTO";
import { SequenceConfigurationTO } from "../to/SequenceConfigurationTO";
import { SequenceStateTO } from "../to/SequenceStateTO";
import { SequenceStepTO } from "../to/SequenceStepTO";
import { SequenceTO } from "../to/SequenceTO";

export class DataStoreCTO {
    constructor(
        public projectName: string = DEFAULT_PROJECT_NAME,
        public version: number = DAVIT_VERISON,
        public actorZoom: number = DEFAULT_ZOOM,
        public dataZoom: number = DEFAULT_ZOOM,
        // Actors
        public actors = new Map<number, ActorTO>(),
        public groups = new Map<number, GroupTO>(),
        // Technical
        public positions = new Map<number, PositionTO>(),
        public designs = new Map<number, DesignTO>(),
        public geometricalDatas = new Map<number, GeometricalDataTO>(),
        // Sequence
        public sequences = new Map<number, SequenceTO>(),
        public steps = new Map<number, SequenceStepTO>(),
        public actions = new Map<number, ActionTO>(),
        public decisions = new Map<number, DecisionTO>(),
        // Data
        public datas = new Map<number, DataTO>(),
        public dataConnections = new Map<number, DataRelationTO>(),
        // Configuration
        public sequenceConfigurations = new Map<number, SequenceConfigurationTO>(),
        public chainConfigurations = new Map<number, ChainConfigurationTO>(),
        // Chain
        public chains = new Map<number, ChainTO>(),
        public chainLinks = new Map<number, ChainLinkTO>(),
        public chainDecisions = new Map<number, ChainDecisionTO>(),
        // Mock
        public sequenceStates = new Map<number, SequenceStateTO>(),
        public chainStates = new Map<number, ChainStateTO>(),
    ) {
    }
}
