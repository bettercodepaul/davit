export type GoToChain = IntermediateChain | TerminalChain;
export type IntermediateChain = { type: GoToTypesChain.LINK | GoToTypesChain.DEC; id: number };
export type TerminalChain = { type: GoToTypesChain.FIN | GoToTypesChain.ERROR };

export enum GoToTypesChain {
    FIN = "FIN",
    ERROR = "ERROR",
    LINK = "LINK",
    DEC = "DEC",
}
