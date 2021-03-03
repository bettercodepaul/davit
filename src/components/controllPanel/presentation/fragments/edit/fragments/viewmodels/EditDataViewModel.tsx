import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataCTO } from '../../../../../../../dataAccess/access/cto/DataCTO';
import { EditActions, editSelectors } from '../../../../../../../slices/EditSlice';
import { EditData } from '../../../../../../../slices/thunks/DataThunks';
import { DavitUtil } from '../../../../../../../utils/DavitUtil';
import { GlobalActions } from '../../../../../../../slices/GlobalSlice';

export const useEditDataViewModel = () => {
    const dataToEdit: DataCTO | null = useSelector(editSelectors.selectDataToEdit);
    const dispatch = useDispatch();

    useEffect(() => {
        // check if component to edit is really set or gso back to edit mode
        if (dataToEdit === null || dataToEdit === undefined) {
            dispatch(GlobalActions.handleError('Tried to go to edit data without dataToedit specified'));
            dispatch(EditActions.setMode.edit());
        }
    });

    const changeName = (name: string) => {
        const copyDataToEdit: DataCTO = DavitUtil.deepCopy(dataToEdit);
        copyDataToEdit.data.name = name;
        dispatch(EditActions.setMode.editData(copyDataToEdit));
    };

    const updateData = () => {
        const copyDataToEdit: DataCTO = DavitUtil.deepCopy(dataToEdit);
        dispatch(EditData.save(copyDataToEdit));
    };

    const saveData = () => {
        if (dataToEdit?.data.name !== '') {
            dispatch(EditData.save(dataToEdit!));
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
        dispatch(EditActions.setMode.editData());
    };

    const editOrAddInstance = (id?: number) => {
        if (dataToEdit !== null) {
            dispatch(EditActions.setMode.editDataInstance(id));
        }
    };

    const saveNote = (text: string) => {
        if (!DavitUtil.isNullOrUndefined(dataToEdit) && text !== '') {
            const copyDataToEdit: DataCTO = DavitUtil.deepCopy(dataToEdit);
            copyDataToEdit.data.note = text;
            dispatch(EditActions.setMode.editData(copyDataToEdit));
        }
    };

    return {
        label: 'EDIT * ' + (dataToEdit?.data.name || ''),
        name: dataToEdit?.data.name,
        changeName,
        saveData,
        deleteData,
        updateData,
        createAnother,
        instances: dataToEdit?.data.instances ? dataToEdit.data.instances : [],
        editOrAddInstance,
        id: dataToEdit?.data.id || -1,
        note: dataToEdit ? dataToEdit.data.note : '',
        saveNote,
    };
};
