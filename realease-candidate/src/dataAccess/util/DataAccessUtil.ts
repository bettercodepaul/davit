import { AbstractTO } from "../access/to/AbstractTO";

export const DataAccessUtil = {
    determineNewId(abstractTOs: AbstractTO[]): number {
        let id = Math.max(...abstractTOs.map((abstract) => abstract.id)) + 1;
        if (id === -Infinity) {
            id = 1;
        }
        return id;
    },
};
