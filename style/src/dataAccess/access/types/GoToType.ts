export type GoTo = Intermediate | Terminal;
export type Intermediate = { type: GoToTypes.STEP | GoToTypes.DEC; id: number };
export type Terminal = { type: GoToTypes.FIN | GoToTypes.ERROR | GoToTypes.IDLE };

export enum GoToTypes {
    FIN = "FIN",
    ERROR = "ERROR",
    IDLE = "IDLE",
    STEP = "STEP",
    DEC = "DEC",
}
