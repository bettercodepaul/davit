import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SequenceCTO } from "../../../../../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../../../../../dataAccess/access/cto/SequenceStepCTO";
import { ActionTO } from "../../../../../../../../dataAccess/access/to/ActionTO";
import { DecisionTO } from "../../../../../../../../dataAccess/access/to/DecisionTO";
import { GoTo, GoToTypes } from "../../../../../../../../dataAccess/access/types/GoToType";
import { EditActions, editSelectors } from "../../../../../../../../slices/EditSlice";
import { GlobalActions } from "../../../../../../../../slices/GlobalSlice";
import { MasterDataActions } from "../../../../../../../../slices/MasterDataSlice";
import { SequenceModelActions, sequenceModelSelectors } from "../../../../../../../../slices/SequenceModelSlice";
import { EditAction } from "../../../../../../../../slices/thunks/ActionThunks";
import { EditSequence } from "../../../../../../../../slices/thunks/SequenceThunks";
import { EditStep } from "../../../../../../../../slices/thunks/StepThunks";
import { useAppDispatch } from "../../../../../../../../store";
import { DavitUtil } from "../../../../../../../../utils/DavitUtil";

export const useStepViewModel = () => {
    const stepToEdit: SequenceStepCTO | null = useSelector(editSelectors.selectStepToEdit);
    const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
    const dispatch = useAppDispatch();
    const [currentGoTo, setCurrentGoTo] = useState<GoTo>({
        type: GoToTypes.STEP,
        id: -1,
    });
    const [key, setKey] = useState<number>(0);

    useEffect(() => {
        if (stepToEdit === undefined || null) {
            dispatch(GlobalActions.handleError("Tried to go to edit sequence step without sequenceStepToEdit specified"));
            dispatch(EditActions.setMode.edit());
        }
        if (stepToEdit) {
            setCurrentGoTo(stepToEdit.sequenceStepTO.goto);
        }

    }, [dispatch, stepToEdit]);

    const changeName = (name: string) => {
        if (!DavitUtil.isNullOrUndefined(stepToEdit)) {
            const copySequenceStep: SequenceStepCTO = DavitUtil.deepCopy(stepToEdit);
            copySequenceStep.sequenceStepTO.name = name;
            dispatch(EditActions.setMode.editStep(copySequenceStep));
            dispatch(EditStep.save(copySequenceStep));
            dispatch(SequenceModelActions.setCurrentSequenceById(copySequenceStep.sequenceStepTO.sequenceFk));
        }
    };

    const saveSequenceStep = (newMode?: string) => {
        if (!DavitUtil.isNullOrUndefined(stepToEdit) && !DavitUtil.isNullOrUndefined(selectedSequence)) {
            if (stepToEdit!.sequenceStepTO.name !== "") {
                dispatch(EditStep.save(stepToEdit!));
            } else {
                dispatch(EditStep.delete(stepToEdit!, selectedSequence!));
            }
            if (newMode && newMode === "EDIT") {
                dispatch(EditActions.setMode.edit());
            } else {
                dispatch(EditActions.setMode.editSequence(stepToEdit!.sequenceStepTO.sequenceFk));
            }
        }
    };

    const deleteSequenceStep = () => {
        if (!DavitUtil.isNullOrUndefined(stepToEdit) && !DavitUtil.isNullOrUndefined(selectedSequence)) {
            dispatch(EditStep.delete(stepToEdit!, selectedSequence!));
            dispatch(EditActions.setMode.editSequence(stepToEdit!.sequenceStepTO.sequenceFk));
        }
    };

    const updateStep = () => {
        if (stepToEdit !== null && undefined) {
            const copySequenceStep: SequenceStepCTO = DavitUtil.deepCopy(stepToEdit);
            dispatch(EditStep.save(copySequenceStep));
        }
    };

    const editOrAddAction = (action?: ActionTO) => {
        if (!DavitUtil.isNullOrUndefined(stepToEdit)) {
            let copyAction: ActionTO | undefined = DavitUtil.deepCopy(action);
            if (copyAction === undefined) {
                copyAction = new ActionTO();
                copyAction.sequenceStepFk = stepToEdit!.sequenceStepTO.id;
                copyAction.index = stepToEdit!.actions.length;
                dispatch(EditAction.create(copyAction));
            } else {
                dispatch(EditActions.setMode.editAction(copyAction));
            }
        }
    };

    const validStep = (): boolean => {
        let valid: boolean = false;
        if (!DavitUtil.isNullOrUndefined(stepToEdit)) {
            if (stepToEdit!.sequenceStepTO.name !== "") {
                valid = true;
            }
        }
        return valid;
    };

    const saveGoToType = (goTo: GoTo) => {
        if (goTo !== undefined) {
            const copySequenceStep: SequenceStepCTO = DavitUtil.deepCopy(stepToEdit);
            copySequenceStep.sequenceStepTO.goto = goTo;
            dispatch(EditStep.update(copySequenceStep));
            dispatch(EditStep.save(copySequenceStep));
            dispatch(SequenceModelActions.setCurrentSequenceById(copySequenceStep.sequenceStepTO.sequenceFk));
        }
    };

    const handleType = (newGoToType?: string) => {
        if (newGoToType !== undefined) {
            const gType = {type: (GoToTypes as any)[newGoToType]};
            setCurrentGoTo(gType);
            switch (newGoToType) {
                case GoToTypes.ERROR:
                    saveGoToType(gType);
                    break;
                case GoToTypes.FIN:
                    saveGoToType(gType);
                    break;
                case GoToTypes.IDLE:
                    saveGoToType(gType);
            }
        }
    };

    const setGoToTypeStep = (step?: SequenceStepCTO) => {
        if (step) {
            const newGoTo: GoTo = {type: GoToTypes.STEP, id: step.sequenceStepTO.id};
            saveGoToType(newGoTo);
        }
    };

    const setGoToTypeDecision = (decision?: DecisionTO) => {
        if (decision) {
            const newGoTo: GoTo = {type: GoToTypes.DEC, id: decision.id};
            saveGoToType(newGoTo);
        }
    };

    const createGoToStep = () => {
        if (!DavitUtil.isNullOrUndefined(stepToEdit)) {
            const goToStep: SequenceStepCTO = new SequenceStepCTO();
            goToStep.sequenceStepTO.sequenceFk = stepToEdit!.sequenceStepTO.sequenceFk;
            const copyStepToEdit: SequenceStepCTO = DavitUtil.deepCopy(stepToEdit);
            setKey(key + 1);
            dispatch(EditActions.setMode.editStep(goToStep, copyStepToEdit));
            dispatch(SequenceModelActions.setCurrentSequenceById(goToStep.sequenceStepTO.sequenceFk));
        }
    };

    const createGoToDecision = () => {
        if (!DavitUtil.isNullOrUndefined(stepToEdit)) {
            const goToDecision: DecisionTO = new DecisionTO();
            goToDecision.sequenceFk = stepToEdit!.sequenceStepTO.sequenceFk;
            const copyStepToEdit: SequenceStepCTO = DavitUtil.deepCopy(stepToEdit);
            dispatch(EditActions.setMode.editDecision(goToDecision, copyStepToEdit));
        }
    };

    const setRoot = () => {
        if (!DavitUtil.isNullOrUndefined(stepToEdit) && !DavitUtil.isNullOrUndefined(selectedSequence)) {
            dispatch(EditSequence.setRoot(stepToEdit!.sequenceStepTO.sequenceFk, stepToEdit!.sequenceStepTO.id, false));
            const step: SequenceStepCTO | undefined = MasterDataActions.find.findSequenceStepCTO(
                stepToEdit!.sequenceStepTO.id,
            );
            if (step) {
                dispatch(EditActions.setMode.editStep(step));
            } else {
                dispatch(EditActions.setMode.edit());
            }
        }
    };

    const saveNote = (text: string) => {
        if (!DavitUtil.isNullOrUndefined(stepToEdit) && text !== "") {
            const copySequenceStep: SequenceStepCTO = DavitUtil.deepCopy(stepToEdit);
            copySequenceStep.sequenceStepTO.note = text;
            dispatch(EditActions.setMode.editStep(copySequenceStep));
            dispatch(EditStep.save(copySequenceStep));
            dispatch(SequenceModelActions.setCurrentSequenceById(copySequenceStep.sequenceStepTO.sequenceFk));
        }
    };

    const switchIndexesAndSave = (indexToUpdate: number, increment: boolean) => {
        const newIndex: number = increment ? indexToUpdate + 1 : indexToUpdate - 1;
        const copyStep: SequenceStepCTO = DavitUtil.deepCopy(stepToEdit);

        if (newIndex >= 0 && newIndex <= copyStep.actions.length - 1) {
            const action1: ActionTO = copyStep.actions[indexToUpdate];
            action1.index = newIndex;
            const action2: ActionTO = copyStep.actions[newIndex];
            action2.index = indexToUpdate;
            copyStep.actions[indexToUpdate] = action2;
            copyStep.actions[newIndex] = action1;

            // save step
            dispatch(EditStep.save(copyStep));

            // load sequence from backend
            dispatch(SequenceModelActions.setCurrentSequenceById(copyStep.sequenceStepTO.sequenceFk));

            // update current step if object to edit
            dispatch(EditStep.update(copyStep));
        }
    };

    return {
        label: "EDIT * " + (selectedSequence?.sequenceTO.name || "") + " * " + (stepToEdit?.sequenceStepTO.name || ""),
        name: stepToEdit ? stepToEdit!.sequenceStepTO.name : "",
        changeName,
        saveSequenceStep,
        deleteSequenceStep,
        validStep,
        editOrAddAction,
        updateStep,
        handleType,
        goTo: currentGoTo,
        setGoToTypeStep,
        setGoToTypeDecision,
        createGoToStep,
        createGoToDecision,
        setRoot,
        isRoot: stepToEdit?.sequenceStepTO.root ? stepToEdit?.sequenceStepTO.root : false,
        key,
        stepId: stepToEdit?.sequenceStepTO.id,
        note: stepToEdit ? stepToEdit.sequenceStepTO.note : "",
        saveNote,
        actions: stepToEdit?.actions || [],
        switchIndexesAndSave,
    };
};
