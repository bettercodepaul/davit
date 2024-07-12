import { ActorDataState } from "./ActorDataState";

export class ActorData {
    constructor(
        public actorFk = -1,
        public dataFk = -1,
        public instanceFk = -1,
        public state = ActorDataState.PERSISTENT,
    ) {
    }
}
