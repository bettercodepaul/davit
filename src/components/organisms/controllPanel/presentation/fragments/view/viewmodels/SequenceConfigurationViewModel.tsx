import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ActorCTO } from "../../../../../../../dataAccess/access/cto/ActorCTO";
import { SequenceConfigurationTO } from "../../../../../../../dataAccess/access/to/SequenceConfigurationTO";
import { EditActions, editSelectors } from "../../../../../../../slices/EditSlice";
import { GlobalActions } from "../../../../../../../slices/GlobalSlice";
import { EditSequenceConfiguration } from "../../../../../../../slices/thunks/SequenceConfigurationThunks";
import { useAppDispatch } from "../../../../../../../store";
import { DavitUtil } from "../../../../../../../utils/DavitUtil";

export const useSequenceConfigurationViewModel = () => {
    const sequenceConfigurationToEdit: SequenceConfigurationTO | null = useSelector(editSelectors.selectSequenceConfigurationToEdit);
    const dispatch = useAppDispatch();
    const [actorToEdit, setActorToEdit] = useState<ActorCTO | null>(null);

    useEffect(() => {
        // check if sequence to edit is really set or gos back to edit mode
        if (DavitUtil.isNullOrUndefined(sequenceConfigurationToEdit)) {
            dispatch(GlobalActions.handleError("Tried to go to edit dataSetup without sequence configuration to edit specified"));
            dispatch(EditActions.setMode.edit());
        }
    }, [sequenceConfigurationToEdit, dispatch]);

    const changeName = (name: string) => {
        if (!DavitUtil.isNullOrUndefined(sequenceConfigurationToEdit)) {
            const copySequenceConfigurationToEdit: SequenceConfigurationTO = DavitUtil.deepCopy(sequenceConfigurationToEdit);
            copySequenceConfigurationToEdit.name = name;
            dispatch(EditSequenceConfiguration.update(copySequenceConfigurationToEdit));
        }
    };

    const saveSequenceConfiguration = () => {
        if (!DavitUtil.isNullOrUndefined(sequenceConfigurationToEdit)) {

            if (sequenceConfigurationToEdit!.name !== "") {
                const copySequenceConfigurationTO: SequenceConfigurationTO = DavitUtil.deepCopy(sequenceConfigurationToEdit);
                copySequenceConfigurationTO!.initDatas = copySequenceConfigurationTO!.initDatas!.filter(initData => initData.dataFk !== -1 && initData.instanceFk !== -1 && initData.actorFk !== -1);
                dispatch(EditSequenceConfiguration.save(copySequenceConfigurationTO!));
            } else {
                deleteSequenceConfiguration();
            }
        }
        dispatch(EditActions.setMode.edit());
    };

    const deleteSequenceConfiguration = () => {
        dispatch(EditSequenceConfiguration.delete(sequenceConfigurationToEdit!));
    };

    const createAnother = () => {
        dispatch(EditActions.setMode.editSequenceConfiguration());
    };

    const updateSequenceConfiguration = () => {
        const copySequenceConfiguration: SequenceConfigurationTO = DavitUtil.deepCopy(sequenceConfigurationToEdit);
        dispatch(EditSequenceConfiguration.save(copySequenceConfiguration));
    };

    const copyDataSetup = () => {
        const copySequenceConfiguration: SequenceConfigurationTO = DavitUtil.deepCopy(sequenceConfigurationToEdit);
        copySequenceConfiguration.name = sequenceConfigurationToEdit?.name + "-copy";
        copySequenceConfiguration.id = -1;
        copySequenceConfiguration.initDatas.forEach((initData) => {
            initData.id = -1;
            initData.dataSetupFk = -1;
        });
        dispatch(EditActions.setMode.editSequenceConfiguration(copySequenceConfiguration.id));
    };

    const getDatas = (): number[] => {
        const dataIds: number[] = [];
        if (!DavitUtil.isNullOrUndefined(sequenceConfigurationToEdit) && !DavitUtil.isNullOrUndefined(actorToEdit)) {
            sequenceConfigurationToEdit!.initDatas
                .filter((initData) => initData.actorFk === actorToEdit!.actor.id)
                .forEach((initData) => dataIds.push(initData.dataFk));
        }
        return dataIds;
    };

    const saveNote = (text: string) => {
        if (!DavitUtil.isNullOrUndefined(sequenceConfigurationToEdit) && text !== "") {
            const copySequenceConfigurationToEdit: SequenceConfigurationTO = DavitUtil.deepCopy(sequenceConfigurationToEdit);
            copySequenceConfigurationToEdit.note = text;
            dispatch(EditSequenceConfiguration.update(copySequenceConfigurationToEdit));
        }
    };

    return {
        label: "EDIT * " + (sequenceConfigurationToEdit?.name || ""),
        name: sequenceConfigurationToEdit?.name,
        changeName,
        saveSequenceConfiguration: saveSequenceConfiguration,
        deleteSequenceConfiguration: deleteSequenceConfiguration,
        copyDataSetup,
        setActorToEdit,
        getInitDatas: sequenceConfigurationToEdit?.initDatas ? sequenceConfigurationToEdit.initDatas : [],
        getDatas,
        createAnother,
        updateDataSetup: updateSequenceConfiguration,
        note: sequenceConfigurationToEdit ? sequenceConfigurationToEdit.note : "",
        saveNote,
        initDatas: sequenceConfigurationToEdit?.initDatas || [],
    };
};
