import { useDispatch } from "react-redux";
import { DavitIcons } from "../../../../../components/atomic/icons/IconSet";
import { DavitTableRowData } from "../../../../../components/organisms/table/DavitTable";
import { SequenceCTO } from "../../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../../dataAccess/access/cto/SequenceStepCTO";
import { DecisionTO } from "../../../../../dataAccess/access/to/DecisionTO";
import { GoTo, GoToTypes, Intermediate } from "../../../../../dataAccess/access/types/GoToType";
import { EditActions } from "../../../../../slices/EditSlice";
import { useAppDispatch } from "../../../../../store";

export const useGetModelSequenceDecisionTableData = (selectedSequence: SequenceCTO | null) => {
    const dispatch = useAppDispatch();

    let bodyData: DavitTableRowData[] = [];
    if (selectedSequence !== null) {
        bodyData = selectedSequence.decisions.map((dec) => {
            const onClickEdit = () => dispatch(EditActions.setMode.editDecision(dec));
            return createDecisionColumn(dec, selectedSequence, onClickEdit);
        });
    }
    return {
        header,
        bodyData,
    };
};

const header = ["NAME", "IF GOTO", "ELSE GOTO", "ACTIONS", "START"];

const createDecisionColumn = (
    decision: DecisionTO,
    selectedSequence: SequenceCTO,
    editCallback: () => void,
): DavitTableRowData => {
    const name = decision.name;
    const ifgotoName: string = getGotoName(
        decision.ifGoTo,
        selectedSequence?.sequenceStepCTOs || [],
        selectedSequence?.decisions || [],
    );
    const elsegotoName: string = getGotoName(
        decision.elseGoTo,
        selectedSequence?.sequenceStepCTOs || [],
        selectedSequence?.decisions || [],
    );
    const root: string = decision.root ? "start" : "";
    const trClass = "carv2Tr";
    const editAction = {icon: DavitIcons.wrench, callback: editCallback};

    return {
        trClass,
        data: [name, ifgotoName, elsegotoName, root],
        actions: [editAction],
    };
};

function getGotoName(goto: GoTo, steps: SequenceStepCTO[], decisions: DecisionTO[]) {
    let gotoName: string = "could not find goto";
    switch (goto.type) {
        case GoToTypes.ERROR:
        case GoToTypes.FIN:
        case GoToTypes.IDLE:
            gotoName = goto.type;
            break;
        case GoToTypes.STEP:
            gotoName =
                steps.find((step) => step.sequenceStepTO.id === (goto as Intermediate).id)?.sequenceStepTO.name ||
                gotoName;
            break;
        case GoToTypes.DEC:
            gotoName = decisions.find((dec) => dec.id === (goto as Intermediate).id)?.name || gotoName;
            break;
    }
    return gotoName;
}
