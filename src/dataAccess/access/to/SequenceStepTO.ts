import { GoTo, GoToTypes } from "../types/GoToType";
import { AbstractTO } from "./AbstractTO";

export class SequenceStepTO extends AbstractTO {
  constructor(
    public name = "",
    public index = -1,
    public sequenceFk = -1,
    public sourceComponentFk = -1,
    public targetComponentFk = -1,
    public goto: GoTo = { type: GoToTypes.STEP, id: -1 }
  ) {
    super();
  }
}
