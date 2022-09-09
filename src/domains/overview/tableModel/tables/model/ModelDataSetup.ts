import { useDispatch } from "react-redux";
import { DavitIcons } from "../../../../../components/atomic/icons/IconSet";
import { DavitTableRowData } from "../../../../../components/organisms/table/DavitTable";
import { DataSetupTO } from "../../../../../dataAccess/access/to/DataSetupTO";
import { EditActions } from "../../../../../slices/EditSlice";
import { SequenceModelActions } from "../../../../../slices/SequenceModelSlice";
import { useAppDispatch } from "../../../../../store";

export const useGetDataSetupTableData = (dataSetups: DataSetupTO[]) => {
    const dispatch = useAppDispatch();
    const bodyData = dataSetups.map((dataSetup) => {
        const onClickEdit = () => dispatch(EditActions.setMode.editDataSetup(dataSetup.id));
        const onClickSelect = () => {
            dispatch(SequenceModelActions.setCurrentDataSetup(dataSetup.id));
            dispatch(EditActions.setMode.view());
        };
        return createModelDataSetupColumn(dataSetup, onClickEdit, onClickSelect);
    });
    return {
        header,
        bodyData,
    };
};

const header = ["NAME", "ACTIONS"];

const createModelDataSetupColumn = (
    dataSetup: DataSetupTO,
    editCallback: () => void,
    selectCallback: () => void,
): DavitTableRowData => {
    const name: string = dataSetup.name;
    const trClass = "carv2Tr";
    const editAction = {icon: DavitIcons.wrench, callback: editCallback};
    const selectAction = {icon: DavitIcons.handPointer, callback: selectCallback};

    return {
        trClass,
        data: [name],
        actions: [editAction, selectAction],
    };
};
