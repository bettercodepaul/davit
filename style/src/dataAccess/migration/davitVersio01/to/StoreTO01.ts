export interface StoreTO01 {
    version: number;
    projectName: string;
    // Acotrs
    actors: any[];
    groups: any[];
    // Technical
    geometricalDatas: any[];
    positions: any[];
    designs: any[];
    // Sequence
    sequences: any[];
    steps: any[];
    actions: any[];
    decisions: any[];
    // Data
    datas: any[];
    dataConnections: any[];
    // setup
    initDatas: any[];
    dataSetups: any[];
    // chain
    chains: any[];
    chainlinks: any[];
    chaindecisions: any[];
}
