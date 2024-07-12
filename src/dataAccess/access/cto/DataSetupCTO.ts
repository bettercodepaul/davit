import { DataSetupTO } from "../to/DataSetupTO";
import { InitDataTO } from "../to/InitDataTO";

export class DataSetupCTO {
    constructor(public dataSetup: DataSetupTO = new DataSetupTO(), public initDatas: InitDataTO[] = []) {
    }
}
