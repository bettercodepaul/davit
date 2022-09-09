import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActorCTO } from "../../../../../../../../dataAccess/access/cto/ActorCTO";
import { DataSetupCTO } from "../../../../../../../../dataAccess/access/cto/DataSetupCTO";
import { InitDataTO } from "../../../../../../../../dataAccess/access/to/InitDataTO";
import { EditActions, editSelectors } from "../../../../../../../../slices/EditSlice";
import { GlobalActions } from "../../../../../../../../slices/GlobalSlice";
import { EditDataSetup } from "../../../../../../../../slices/thunks/DataSetupThunks";
import { EditInitData } from "../../../../../../../../slices/thunks/InitDataThunks";
import { useAppDispatch } from "../../../../../../../../store";
import { DavitUtil } from "../../../../../../../../utils/DavitUtil";

export const useDataSetupViewModel = () => {
    const dataSetupToEdit: DataSetupCTO | null = useSelector(editSelectors.selectDataSetupToEdit);
    const dispatch = useAppDispatch();
    const [actorToEdit, setActorToEdit] = useState<ActorCTO | null>(null);

    useEffect(() => {
        // check if sequence to edit is really set or gos back to edit mode
        if (DavitUtil.isNullOrUndefined(dataSetupToEdit)) {
            dispatch(GlobalActions.handleError("Tried to go to edit dataSetup without dataSetupToedit specified"));
            dispatch(EditActions.setMode.edit());
        }
    }, [dataSetupToEdit, dispatch]);

    const changeName = (name: string) => {
        if (!DavitUtil.isNullOrUndefined(dataSetupToEdit)) {
            const copyDataSetupToEdit: DataSetupCTO = DavitUtil.deepCopy(dataSetupToEdit);
            copyDataSetupToEdit.dataSetup.name = name;
            dispatch(EditDataSetup.update(copyDataSetupToEdit));
        }
    };

    const saveDataSetup = () => {
        if (!DavitUtil.isNullOrUndefined(dataSetupToEdit)) {

            if (dataSetupToEdit!.dataSetup.name !== "") {
                const copyDataSetup: DataSetupCTO = DavitUtil.deepCopy(dataSetupToEdit);
                copyDataSetup!.initDatas = copyDataSetup!.initDatas!.filter(initData => initData.dataFk !== -1 && initData.instanceFk !== -1 && initData.actorFk !== -1);
                dispatch(EditDataSetup.save(copyDataSetup!));
            } else {
                deleteDataSetup();
            }
        }
        dispatch(EditActions.setMode.edit());
    };

    const deleteDataSetup = () => {
        dispatch(EditDataSetup.delete(dataSetupToEdit!));
        dispatch(EditActions.setMode.edit());
    };

    const createAnother = () => {
        dispatch(EditActions.setMode.editDataSetup());
    };

    const updateDataSetup = () => {
        const copyDataSetup: DataSetupCTO = DavitUtil.deepCopy(dataSetupToEdit);
        dispatch(EditDataSetup.save(copyDataSetup));
    };

    const copyDataSetup = () => {
        const copyDataSetup: DataSetupCTO = DavitUtil.deepCopy(dataSetupToEdit);
        copyDataSetup.dataSetup.name = dataSetupToEdit?.dataSetup.name + "-copy";
        copyDataSetup.dataSetup.id = -1;
        copyDataSetup.initDatas.forEach((initData) => {
            initData.id = -1;
            initData.dataSetupFk = -1;
        });
        dispatch(EditActions.setMode.editDataSetup(copyDataSetup.dataSetup.id));
    };

    const getDatas = (): number[] => {
        const dataIds: number[] = [];
        if (!DavitUtil.isNullOrUndefined(dataSetupToEdit) && !DavitUtil.isNullOrUndefined(actorToEdit)) {
            dataSetupToEdit!.initDatas
                .filter((initData) => initData.actorFk === actorToEdit!.actor.id)
                .forEach((initData) => dataIds.push(initData.dataFk));
        }
        return dataIds;
    };

    const editInitData = (initData: InitDataTO | undefined) => {
        if (initData) {
            dispatch(EditActions.setMode.editInitData(initData));
        }
    };

    const createInitData = () => {
        if (!DavitUtil.isNullOrUndefined(dataSetupToEdit)) {
            const initData: InitDataTO = new InitDataTO();
            initData.dataSetupFk = dataSetupToEdit!.dataSetup.id;
            dispatch(EditInitData.save(initData));
            dispatch(EditActions.setMode.editDataSetup(dataSetupToEdit!.dataSetup?.id));
        }
    };

    const saveInitData = (initData: InitDataTO) => {
        console.info(initData);
        if (!DavitUtil.isNullOrUndefined(initData) && !DavitUtil.isNullOrUndefined(dataSetupToEdit)) {
            let copyInitData: InitDataTO = DavitUtil.deepCopy(initData);
            console.info(copyInitData);
            dispatch(EditInitData.save(copyInitData));
            dispatch(EditActions.setMode.editDataSetup(dataSetupToEdit!.dataSetup?.id));
        }
    };

    const deleteInitData = (initData: InitDataTO) => {
        if (!DavitUtil.isNullOrUndefined(initData) && !DavitUtil.isNullOrUndefined(dataSetupToEdit)) {
            dispatch(EditInitData.delete(initData.id));
            dispatch(EditActions.setMode.editDataSetup(dataSetupToEdit!.dataSetup?.id));
        }
    };

    const saveNote = (text: string) => {
        if (!DavitUtil.isNullOrUndefined(dataSetupToEdit) && text !== "") {
            const copyDataSetupToEdit: DataSetupCTO = DavitUtil.deepCopy(dataSetupToEdit);
            copyDataSetupToEdit.dataSetup.note = text;
            dispatch(EditDataSetup.update(copyDataSetupToEdit));
        }
    };

    return {
        label: "EDIT * " + (dataSetupToEdit?.dataSetup.name || ""),
        name: dataSetupToEdit?.dataSetup.name,
        changeName,
        saveDataSetup,
        deleteDataSetup,
        copyDataSetup,
        setActorToEdit,
        getInitDatas: dataSetupToEdit?.initDatas ? dataSetupToEdit.initDatas : [],
        getDatas,
        createAnother,
        updateDataSetup,
        editInitData,
        createInitData,
        note: dataSetupToEdit ? dataSetupToEdit.dataSetup.note : "",
        saveNote,
        initDatas: dataSetupToEdit?.initDatas || [],
        saveInitData,
        deleteInitData,
    };
};
