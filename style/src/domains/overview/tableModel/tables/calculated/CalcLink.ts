import { useDispatch, useSelector } from "react-redux";
import { DavitTableRowData } from "../../../../../components/organisms/table/DavitTable";
import { CalcChain, CalcChainLink } from "../../../../../services/SequenceChainService";
import { SequenceModelActions, sequenceModelSelectors } from "../../../../../slices/SequenceModelSlice";

export const useGetCalcLinkTableData = (calcChain: CalcChain | null) => {
    const dispatch = useDispatch();
    const chainIndex: number | null = useSelector(sequenceModelSelectors.selectCurrentLinkIndex);

    let bodyData: DavitTableRowData[] = [];
    if (calcChain !== null) {
        bodyData = calcChain.calcLinks.map((link, index) => {
            const onClickRow = () => dispatch(SequenceModelActions.setCurrentLinkIndex(index));
            return createCalcLinkColumn(link, index, onClickRow, chainIndex);
        });
    }
    return {
        header,
        bodyData,
    };
};

const header = ["INDEX", "NAME", "SEQUENCE", "DATASETUP", "TERMINAL"];

const createCalcLinkColumn = (
    link: CalcChainLink,
    index: number,
    onClick: () => void,
    chainIndex: number,
): DavitTableRowData => {
    const name: string = link.name || "Link name not found!";
    const sequenceName: string = link.sequence.sequenceModel?.sequenceTO.name || "Sequence name not found!";
    const dataSetupName: string = link.sequenceConfiguration.name || "Sequence Configuration name not found!";
    let trClass = "carv2Tr";
    if (index === chainIndex) {
        trClass = "carv2TrMarked";
    }
    return {
        trClass: "clickable " + trClass,
        data: [(index + 1).toString(), name, sequenceName, dataSetupName, link.sequence.terminal.type.toString()],
        actions: [],
        onClick,
    };
};
