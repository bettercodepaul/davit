import { ChainLinkCTO } from "../../../../dataAccess/access/cto/ChainlinkCTO";
import { ChainDecisionTO } from "../../../../dataAccess/access/to/ChainDecisionTO";
import { GoToChain, GoToTypesChain, IntermediateChain } from "../../../../dataAccess/access/types/GoToTypeChain";

export function getChainGotoName(
    goto: GoToChain,
    selectedChainlinks: ChainLinkCTO[],
    selectedChainDecisions: ChainDecisionTO[],
) {
    let gotoName: string = "could not find goto";
    switch (goto.type) {
        case GoToTypesChain.ERROR:
        case GoToTypesChain.FIN:
            gotoName = goto.type;
            break;
        case GoToTypesChain.LINK:
            gotoName =
                selectedChainlinks.find((link) => link.chainLink.id === (goto as IntermediateChain).id)?.chainLink
                    .name || gotoName;
            break;
        case GoToTypesChain.DEC:
            gotoName =
                selectedChainDecisions.find((dec) => dec.id === (goto as IntermediateChain).id)?.name || gotoName;
            break;
    }
    return gotoName;
}
