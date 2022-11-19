import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SequenceCTO } from "../../../../../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../../../../../dataAccess/access/cto/SequenceStepCTO";
import { DecisionTO } from "../../../../../../../../dataAccess/access/to/DecisionTO";
import { SequenceStateTO } from "../../../../../../../../dataAccess/access/to/SequenceStateTO";
import { SequenceTO } from "../../../../../../../../dataAccess/access/to/SequenceTO";
import { EditActions, editSelectors } from "../../../../../../../../slices/EditSlice";
import { GlobalActions } from "../../../../../../../../slices/GlobalSlice";
import { sequenceModelSelectors } from "../../../../../../../../slices/SequenceModelSlice";
import { EditSequenceState } from "../../../../../../../../slices/thunks/SequenceStateThunk";
import { EditSequence } from "../../../../../../../../slices/thunks/SequenceThunks";
import { useAppDispatch } from "../../../../../../../../store";
import { DavitUtil } from "../../../../../../../../utils/DavitUtil";

export const useSequenceViewModel = () => {
    const sequenceToEdit: SequenceTO | null = useSelector(editSelectors.selectSequenceToEdit);
    const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
    const dispatch = useAppDispatch();
    const [isCreateAnother, setIsCreateAnother] = useState<boolean>(false);

    useEffect(() => {
        // check if sequence to edit is really set or gos back to edit mode
        if (DavitUtil.isNullOrUndefined(sequenceToEdit)) {
            dispatch(GlobalActions.handleError("Tried to go to edit sequence without sequenceToEdit specified"));
            dispatch(EditActions.setMode.edit());
        }
        if (sequenceToEdit?.id !== -1) {
            setIsCreateAnother(false);
        }
    }, [sequenceToEdit, dispatch]);

    const changeName = (name: string) => {
        if (!DavitUtil.isNullOrUndefined(sequenceToEdit)) {
            const copySequenceToEdit: SequenceTO = DavitUtil.deepCopy(sequenceToEdit);
            copySequenceToEdit.name = name;
            dispatch(EditSequence.save(copySequenceToEdit));
        }
    };

    const saveSequence = () => {
        if (sequenceToEdit!.name !== "") {
            dispatch(EditSequence.save(sequenceToEdit!));
        } else {
            dispatch(EditSequence.delete(sequenceToEdit!));
        }
        if (isCreateAnother) {
            dispatch(EditActions.setMode.editSequence());
        } else {
            dispatch(EditActions.setMode.edit());
        }
    };

    const deleteSequence = () => {
        dispatch(EditSequence.delete(sequenceToEdit!));
        dispatch(EditActions.setMode.edit());
    };

    const validateInput = (): boolean => {
        if (!DavitUtil.isNullOrUndefined(sequenceToEdit)) {
            return DavitUtil.isValidName(sequenceToEdit!.name);
        } else {
            return false;
        }
    };

    const editOrAddSequenceStep = (step?: SequenceStepCTO) => {
        let stepToEdit: SequenceStepCTO | undefined = step;
        if (stepToEdit === undefined) {
            stepToEdit = new SequenceStepCTO();
            stepToEdit.sequenceStepTO.sequenceFk = sequenceToEdit?.id || -1;
            stepToEdit.sequenceStepTO.root = isFirst();
        }
        dispatch(EditActions.setMode.editStep(stepToEdit));
    };

    const editOrAddDecision = (decision?: DecisionTO) => {
        let decisionToEdit: DecisionTO | undefined = decision;
        if (decisionToEdit === undefined) {
            decisionToEdit = new DecisionTO();
            decisionToEdit.sequenceFk = sequenceToEdit?.id || -1;
            decisionToEdit.root = isFirst();
        }
        dispatch(EditActions.setMode.editDecision(decisionToEdit));
    };

    const isFirst = (): boolean => {
        return selectedSequence?.sequenceStepCTOs.length === 0 && selectedSequence.decisions.length === 0;
    };

    const copySequence = () => {
        const copySequence: SequenceTO = DavitUtil.deepCopy(sequenceToEdit);
        copySequence.name = sequenceToEdit?.name + "-copy";
        copySequence.id = -1;
        dispatch(EditSequence.update(copySequence));
    };

    const createAnother = () => {
        dispatch(EditActions.setMode.editSequence());
    };

    const updateSequence = () => {
        const copySequence: SequenceTO = DavitUtil.deepCopy(sequenceToEdit);
        dispatch(EditSequence.save(copySequence));
    };

    const saveNote = (text: string) => {
        if (!DavitUtil.isNullOrUndefined(sequenceToEdit)) {
            const copySequenceToEdit: SequenceTO = DavitUtil.deepCopy(sequenceToEdit);
            copySequenceToEdit.note = text;
            dispatch(EditSequence.save(copySequenceToEdit));
        }
    };

    // ---------------------- STATE ----------------------

    const saveSequenceState = (stateToSave: SequenceStateTO) => {
        dispatch(EditSequenceState.save(stateToSave));
    };

    const createSequenceState = () => {
        if (!DavitUtil.isNullOrUndefined(sequenceToEdit)) {
            let newSequenceState: SequenceStateTO = new SequenceStateTO();
            newSequenceState.sequenceFk = sequenceToEdit!.id;
            saveSequenceState(newSequenceState);
        }
    };

    const deleteSequenceState = (stateToDeleteId: number) => {
        dispatch(EditSequenceState.delete(stateToDeleteId));
    };

    const editSequence = () => {
        if (!DavitUtil.isNullOrUndefined(sequenceToEdit)) {
            dispatch(EditActions.setMode.editSequence(sequenceToEdit!.id));
        }
    };

    const editStates = () => {
        if (!DavitUtil.isNullOrUndefined(sequenceToEdit)) {
            dispatch(EditActions.setMode.editSequenceStates());
        }
    };

    return {
        label: "EDIT * " + (sequenceToEdit?.name || ""),
        name: sequenceToEdit?.name,
        changeName,
        saveSequence,
        deleteSequence,
        editOrAddSequenceStep,
        validateInput,
        copySequence,
        createAnother,
        updateSequence,
        editOrAddDecision,
        id: sequenceToEdit?.id || -1,
        note: sequenceToEdit ? sequenceToEdit.note : "",
        saveNote,
        saveSequenceState,
        deleteSequenceState,
        createSequenceState,
        editStates,
        editSequence,
    };
};
