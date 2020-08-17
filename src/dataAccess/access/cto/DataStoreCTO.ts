import { ActionTO } from "../to/ActionTO";
import { ChainTO } from "../to/ChainTO";
import { ComponentTO } from "../to/ComponentTO";
import { DataRelationTO } from "../to/DataRelationTO";
import { DataSetupTO } from "../to/DataSetupTO";
import { DataTO } from "../to/DataTO";
import { DecisionTO } from "../to/DecisionTO";
import { DesignTO } from "../to/DesignTO";
import { GeometricalDataTO } from "../to/GeometricalDataTO";
import { GroupTO } from "../to/GroupTO";
import { InitDataTO } from "../to/InitDataTO";
import { PositionTO } from "../to/PositionTO";
import { SequenceStepTO } from "../to/SequenceStepTO";
import { SequenceTO } from "../to/SequenceTO";

export class DataStoreCTO {
  constructor(
    // Components
    public components = new Map<number, ComponentTO>(),
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
    // Setup
    public initDatas = new Map<number, InitDataTO>(),
    public dataSetups = new Map<number, DataSetupTO>(),
    // Chain
    public chains = new Map<number, ChainTO>()
  ) {}
}
