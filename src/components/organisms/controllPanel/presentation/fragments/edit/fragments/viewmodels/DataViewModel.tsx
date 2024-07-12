import { useEffect } from "react";
import { useSelector } from "react-redux";
import { DataCTO } from "../../../../../../../../dataAccess/access/cto/DataCTO";
import { EditActions, editSelectors } from "../../../../../../../../slices/EditSlice";
import { GlobalActions } from "../../../../../../../../slices/GlobalSlice";
import { EditData } from "../../../../../../../../slices/thunks/DataThunks";
import { useAppDispatch } from "../../../../../../../../store";
import { DavitUtil } from "../../../../../../../../utils/DavitUtil";

export const useDataViewModel = () => {
    const dataToEdit: DataCTO | null = useSelector(editSelectors.selectDataToEdit);
    const dispatch = useAppDispatch();

    useEffect(() => {
        // check if component to edit is really set or gso back to edit mode
        if (dataToEdit === null || dataToEdit === undefined) {
            dispatch(GlobalActions.handleError("Tried to go to edit data without dataToedit specified"));
            dispatch(EditActions.setMode.edit());
        }
    });

    const changeDataName = (name: string) => {
        const copyDataToEdit: DataCTO = DavitUtil.deepCopy(dataToEdit);
        copyDataToEdit.data.name = name;
        dispatch(EditActions.setMode.editData(copyDataToEdit));
    };

    const changeInstanceName = (name: string, instanceIndex: number) => {
        if (dataToEdit !== null && instanceIndex !== null) {
            const copyData: DataCTO = DavitUtil.deepCopy(dataToEdit);
            copyData.data.instances[instanceIndex].name = name;
            dispatch(EditActions.setMode.editData(copyData));
        }
    };

    const updateData = () => {
        const copyDataToEdit: DataCTO = DavitUtil.deepCopy(dataToEdit);
        dispatch(EditData.save(copyDataToEdit));
    };

    const saveData = () => {
        if (dataToEdit?.data.name !== "") {
            const copyData: DataCTO = DavitUtil.deepCopy(dataToEdit);
            copyData.data.instances = copyData.data.instances.filter(instance => instance.name !== "");
            dispatch(EditData.save(copyData!));
        } else {
            deleteData();
        }
        dispatch(EditActions.setMode.edit());
    };

    const deleteData = () => {
        if (!DavitUtil.isNullOrUndefined(dataToEdit)) {
            dispatch(EditData.delete(dataToEdit!));
            dispatch(EditActions.setMode.edit());
        }
    };

    const createAnother = () => {
        saveData();
        dispatch(EditActions.setMode.editData());
    };


    const saveNote = (text: string) => {
        if (!DavitUtil.isNullOrUndefined(dataToEdit) && text !== "") {
            const copyDataToEdit: DataCTO = DavitUtil.deepCopy(dataToEdit);
            copyDataToEdit.data.note = text;
            dispatch(EditActions.setMode.editData(copyDataToEdit));
        }
    };

    const createInstance = () => {
        if (!DavitUtil.isNullOrUndefined(dataToEdit)) {
            const copyData: DataCTO = DavitUtil.deepCopy(dataToEdit);
            copyData.data.instances.push({id: -1, name: ""});
            dispatch(EditActions.setMode.editData(copyData));
        }
    };

    const deleteInstance = (indexToDelete: number) => {
        if (!DavitUtil.isNullOrUndefined(dataToEdit)) {
            const copyData: DataCTO = DavitUtil.deepCopy(dataToEdit);
            copyData.data.instances.splice(indexToDelete, 1);
            dispatch(EditActions.setMode.editData(copyData));
        }
    };

    return {
        label: "EDIT * " + (dataToEdit?.data.name || ""),
        name: dataToEdit?.data.name,
        changeName: changeDataName,
        saveData,
        deleteData,
        updateData,
        createAnother,
        instances: dataToEdit?.data.instances ? dataToEdit.data.instances : [],
        id: dataToEdit?.data.id || -1,
        note: dataToEdit ? dataToEdit.data.note : "",
        saveNote,
        changeInstanceName,
        createInstance,
        deleteInstance
    };
};
