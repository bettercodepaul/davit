import { DavitIcons } from "../../../../../components/atomic/icons/IconSet";
import { DavitTableRowData } from "../../../../../components/organisms/table/DavitTable";
import { ChainLinkCTO } from "../../../../../dataAccess/access/cto/ChainlinkCTO";
import { ChainDecisionTO } from "../../../../../dataAccess/access/to/ChainDecisionTO";
import { EditActions } from "../../../../../slices/EditSlice";
import { useAppDispatch } from "../../../../../store";
import { getChainGotoName } from "../../util/TableUtil";

export const useGetModelChainLinkTableData = (
    selectedChainlinks: ChainLinkCTO[],
    selectedChainDecisions: ChainDecisionTO[],
) => {
    const dispatch = useAppDispatch();

    const bodyData: DavitTableRowData[] = selectedChainlinks.map((link) => {
        const onClickEdit = () => dispatch(EditActions.setMode.editChainLink(link.chainLink));
        return createLinkColumn(link, selectedChainlinks, selectedChainDecisions, onClickEdit);
    });
    return {
        header,
        bodyData,
    };
};

const header = ["NAME", "SEQUENCE", "DATASETUP", "GOTO", "ACTIONS", "START"];

const createLinkColumn = (
    link: ChainLinkCTO,
    selectedChainlinks: ChainLinkCTO[],
    selectedChainDecisions: ChainDecisionTO[],
    editCallback: () => void,
): DavitTableRowData => {
    const name: string = link.chainLink.name;
    const sequenceName: string = link.sequence.sequenceTO.name;
    const dataSetupName: string = link.sequenceConfiguration.name;
    const gotoName: string = getChainGotoName(link.chainLink.goto, selectedChainlinks, selectedChainDecisions);
    const root: string = link.chainLink.root ? "start" : "";
    const trClass = "carv2Tr";
    const editAction = {icon: DavitIcons.wrench, callback: editCallback};

    return {
        trClass,
        data: [name, sequenceName, dataSetupName, gotoName, root],
        actions: [editAction],
    };
};
