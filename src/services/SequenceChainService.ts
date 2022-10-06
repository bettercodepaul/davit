import { ChainCTO } from "../dataAccess/access/cto/ChainCTO";
import { ChainlinkCTO } from "../dataAccess/access/cto/ChainlinkCTO";
import { DataSetupCTO } from "../dataAccess/access/cto/DataSetupCTO";
import { ActionTO } from "../dataAccess/access/to/ActionTO";
import { ChainDecisionTO } from "../dataAccess/access/to/ChainDecisionTO";
import { GoToChain, GoToTypesChain, TerminalChain } from "../dataAccess/access/types/GoToTypeChain";
import { DavitUtil } from "../utils/DavitUtil";
import { ActorData } from "../viewDataTypes/ActorData";
import { CalcSequence, SequenceService } from "./SequenceService";

export interface CalcChainLink {
    name: string;
    chainLinkId: number;
    stepId: string;
    dataSetup: DataSetupCTO;
    sequence: CalcSequence;
    errors: ActionTO[];
}

export interface CalcChain {
    calcLinks: CalcChainLink[];
    linkIds: string[];
    loopStartingIndex?: number;
    terminal: TerminalChain;
}

export const SequenceChainService = {
    calculateChain: (sequenceChain: ChainCTO | null): CalcChain => {
        const calcSequenceChain: CalcChain = {calcLinks: [], linkIds: [], terminal: {type: GoToTypesChain.ERROR}};
        let loopStartingStep: number = -1;
        let actorDatas: ActorData[] = [];

        if (sequenceChain) {
            const root: ChainlinkCTO | null = getRoot(sequenceChain);

            if (root) {
                let step: ChainlinkCTO | ChainDecisionTO | TerminalChain = root;
                let type = getType(step);
                let stepId: string = "";

                while (!isLooping(loopStartingStep) && (type === GoToTypesChain.LINK || type === GoToTypesChain.DEC)) {
                    if (type === GoToTypesChain.LINK) {
                        const link: ChainlinkCTO = step as ChainlinkCTO;

                        loopStartingStep = checkForLoop(calcSequenceChain, link, actorDatas);

                        const result: CalcSequence = SequenceService.calculateSequence(
                            link.sequence,
                            link.dataSetup,
                            actorDatas,
                        );

                        actorDatas =
                            result.calculatedSteps.length > 0
                                ? result.calculatedSteps[result.calculatedSteps.length - 1].actorDatas
                                : [];

                        // STEP ID
                        const newLinkId = "_LINK_" + link.chainLink.id;
                        stepId = stepId === "" ? link.chainLink.id.toString() : stepId + newLinkId;
                        calcSequenceChain.linkIds.push(stepId);

                        calcSequenceChain.calcLinks.push({
                            name: link.chainLink.name,
                            chainLinkId: link.chainLink.id,
                            stepId: stepId,
                            sequence: result,
                            dataSetup: link.dataSetup,
                            errors: result.calculatedSteps.map((step) => step.errors).flat(1),
                        });

                        if (!isLooping(loopStartingStep)) {
                            // set next object.
                            step = getNext((step as ChainlinkCTO).chainLink.goto, sequenceChain);
                            type = getType(step);
                        }
                    }

                    if (type === GoToTypesChain.DEC) {
                        const decision: ChainDecisionTO = step as ChainDecisionTO;

                        const goTo: GoToChain = executeChainDecisionCheck(decision, actorDatas);
                        step = getNext(goTo, sequenceChain);
                        type = getType(step);

                        const newCondID = "_DEC_" + decision.id;
                        stepId = stepId === "" ? "root" : stepId + newCondID;
                        calcSequenceChain.linkIds.push(stepId);
                    }
                }
                if (!isLooping(loopStartingStep)) {
                    calcSequenceChain.terminal = step as TerminalChain;
                    calcSequenceChain.linkIds.push(stepId + "_" + (step as TerminalChain).type);
                }
            }
        }
        return {...calcSequenceChain, loopStartingIndex: isLooping(loopStartingStep) ? loopStartingStep : undefined};
    },
};

const executeChainDecisionCheck = (chainDecision: ChainDecisionTO, actorDatas: ActorData[]): GoToChain => {
    // const filteredCompData: ActorData[] = actorDatas.filter((actorData) => actorData.actorFk === chainDecision.actorFk);
    let goTo: GoToChain | undefined;
    if ((chainDecision.conditions || []).length > 0) {
        chainDecision.conditions.forEach((condition) => {
            const isIncluded: boolean = actorDatas.some(
                (cd) => cd.dataFk === condition.dataFk && cd.instanceFk === condition.instanceFk && cd.actorFk === condition.actorFk,
            );
            if (!isIncluded) {
                goTo = chainDecision.elseGoTo;
            }
        });
    }
    return goTo || chainDecision.ifGoTo;
};

const getLinkFromChain = (linkId: number, chain: ChainCTO): ChainlinkCTO | undefined => {
    return chain.links.find((link) => link.chainLink.id === linkId);
};

const getDecisionFromChain = (id: number, chain: ChainCTO): ChainDecisionTO | undefined => {
    return chain.decisions.find((decision) => decision.id === id);
};

export const getRoot = (chain: ChainCTO | null): ChainlinkCTO | null => {
    let rootLink: ChainlinkCTO | null = null;
    if (!DavitUtil.isNullOrUndefined(chain)) {
        rootLink = chain!.links.find((link) => link.chainLink.root) || null;
    }
    return rootLink;
};

const getNext = (goTo: GoToChain, chain: ChainCTO): ChainlinkCTO | ChainDecisionTO | TerminalChain => {
    let nextStepOrDecisionOrTerminal: ChainlinkCTO | ChainDecisionTO | TerminalChain = {type: GoToTypesChain.ERROR};
    switch (goTo.type) {
        case GoToTypesChain.LINK:
            nextStepOrDecisionOrTerminal = getLinkFromChain(goTo.id, chain) || {type: GoToTypesChain.ERROR};
            break;
        case GoToTypesChain.DEC:
            nextStepOrDecisionOrTerminal = getDecisionFromChain(goTo.id, chain) || {type: GoToTypesChain.ERROR};
            break;
        case GoToTypesChain.FIN:
            nextStepOrDecisionOrTerminal = {type: GoToTypesChain.FIN};
    }
    return nextStepOrDecisionOrTerminal;
};

const getType = (step: ChainlinkCTO | ChainDecisionTO | TerminalChain): GoToTypesChain => {
    if ((step as ChainlinkCTO).chainLink) {
        return GoToTypesChain.LINK;
    } else if ((step as ChainDecisionTO).elseGoTo) {
        return GoToTypesChain.DEC;
    } else if ((step as TerminalChain).type) {
        return (step as TerminalChain).type;
    } else {
        throw Error("Illegal Type in Sequence");
    }
};

const checkForLoop = (calcSequenceChain: CalcChain, step: ChainlinkCTO, actorDatas: ActorData[]): number => {
    return calcSequenceChain.calcLinks.findIndex(
        (calcLink) =>
            calcLink.chainLinkId === step.chainLink.id &&
            calcLink.sequence.calculatedSteps[0].actorDatas.length === actorDatas.length &&
            !calcLink.sequence.calculatedSteps[0].actorDatas.some(
                (cp) => !actorDatas.some((rcp) => rcp.actorFk === cp.actorFk && rcp.dataFk === cp.dataFk),
            ),
    );
};

const isLooping = (loopStartingStep: number) => {
    return loopStartingStep > -1;
};
