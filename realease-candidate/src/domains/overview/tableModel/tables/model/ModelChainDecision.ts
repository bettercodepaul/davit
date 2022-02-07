import { useDispatch } from "react-redux";
import { DavitIcons } from "../../../../../components/atomic/icons/IconSet";
import { DavitTableRowData } from "../../../../../components/organisms/table/DavitTable";
import { ChainlinkCTO } from "../../../../../dataAccess/access/cto/ChainlinkCTO";
import { ChainDecisionTO } from "../../../../../dataAccess/access/to/ChainDecisionTO";
import { CalcChain } from "../../../../../services/SequenceChainService";
import { EditActions } from "../../../../../slices/EditSlice";
import { getChainGotoName } from "../../util/TableUtil";

export const useGetModelChainDecisionTableData = (
    calcChain: CalcChain | null,
    selectedChainLinks: ChainlinkCTO[],
    selectedChainDecisions: ChainDecisionTO[],
) => {
    const dispatch = useDispatch();

    let bodyData: DavitTableRowData[] = [];
    if (calcChain !== null) {
        bodyData = selectedChainDecisions.map((decision) => {
            const onClickEdit = () => dispatch(EditActions.setMode.editChainDecision(decision));
            return createChainDecisionColumn(decision, selectedChainLinks, selectedChainDecisions, onClickEdit);
        });
    }
    return {
        header,
        bodyData,
    };
};

const header = ["NAME", "IF GOTO", "ELSE GOTO", "ACTIONS"];

const createChainDecisionColumn = (
    decision: ChainDecisionTO,
    selectedChainlinks: ChainlinkCTO[],
    selectedChainDecisions: ChainDecisionTO[],
    editCallback: () => void,
): DavitTableRowData => {
    const name: string = decision.name;
    const ifgoto: string = getChainGotoName(decision.ifGoTo, selectedChainlinks, selectedChainDecisions);
    const elsegoto: string = getChainGotoName(decision.elseGoTo, selectedChainlinks, selectedChainDecisions);
    const trClass = "carv2Tr";

    const editAction = {icon: DavitIcons.wrench, callback: editCallback};

    return {
        trClass,
        data: [name, ifgoto, elsegoto],
        actions: [editAction],
    };
};
