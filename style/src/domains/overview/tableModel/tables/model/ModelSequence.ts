import { useDispatch } from "react-redux";
import { DavitIcons } from "../../../../../components/atomic/icons/IconSet";
import { DavitTableAction, DavitTableRowData } from "../../../../../components/organisms/table/DavitTable";
import { SequenceTO } from "../../../../../dataAccess/access/to/SequenceTO";
import { EditActions } from "../../../../../slices/EditSlice";
import { SequenceModelActions } from "../../../../../slices/SequenceModelSlice";

export const useGetSequenceModelsTableBody = (sequences: SequenceTO[]) => {
    const dispatch = useDispatch();

    let bodyData: DavitTableRowData[] = [];
    if (sequences) {
        bodyData = sequences.map((sequence) => {
            const selectAction = () => {
                dispatch(SequenceModelActions.setCurrentSequenceById(sequence.id));
                dispatch(EditActions.setMode.view());
            };
            const editAction = () => dispatch(EditActions.setMode.editSequence(sequence.id));

            return createSequenceModelColumn(sequence, editAction, selectAction);
        });
    }
    return {
        header,
        bodyData,
    };
};

const header = ["NAME", "ACTIONS"];

const createSequenceModelColumn = (
    sequence: SequenceTO,
    editCallback: () => void,
    selectCallback: () => void,
): DavitTableRowData => {
    const name = sequence.name;
    const trClass = "carv2Tr";
    const editAction: DavitTableAction = {icon: DavitIcons.wrench, callback: editCallback};
    const selectAction: DavitTableAction = {icon: DavitIcons.handPointer, callback: selectCallback};

    return {
        data: [name],
        trClass: trClass,
        actions: [editAction, selectAction],
    };
};
