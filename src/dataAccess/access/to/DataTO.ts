import { AbstractTO } from "./AbstractTO";

export class DataTO extends AbstractTO {
  constructor(public name: string = "", public geometricalDataFk: number = -1) {
    super();
  }
}
