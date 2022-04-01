import { useDispatch } from "react-redux";
import { DavitIcons } from "../../../../../components/atomic/icons/IconSet";
import { DavitTableRowData } from "../../../../../components/organisms/table/DavitTable";
import { SequenceConfigurationTO } from "../../../../../dataAccess/access/to/SequenceConfigurationTO";
import { EditActions } from "../../../../../slices/EditSlice";
import { SequenceModelActions } from "../../../../../slices/SequenceModelSlice";

export const useGetDataSetupTableData = (dataSetups: SequenceConfigurationTO[]) => {
    const dispatch = useDispatch();
    let bodyData: DavitTableRowData[];
    bodyData = dataSetups.map((dataSetup) => {
        const onClickEdit = () => dispatch(EditActions.setMode.editSequenceConfiguration(dataSetup.id));
        const onClickSelect = () => {
            dispatch(SequenceModelActions.setCurrentSequenceConfigurationById(dataSetup.id));
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
    dataSetup: SequenceConfigurationTO,
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
