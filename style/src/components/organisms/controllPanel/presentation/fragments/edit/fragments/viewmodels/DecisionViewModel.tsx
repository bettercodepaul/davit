import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SequenceCTO } from "../../../../../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../../../../../dataAccess/access/cto/SequenceStepCTO";
import { ConditionTO } from "../../../../../../../../dataAccess/access/to/ConditionTO";
import { DecisionTO, StateFkAndStateCondition } from "../../../../../../../../dataAccess/access/to/DecisionTO";
import { GoTo, GoToTypes } from "../../../../../../../../dataAccess/access/types/GoToType";
import { EditActions, editSelectors } from "../../../../../../../../slices/EditSlice";
import { GlobalActions } from "../../../../../../../../slices/GlobalSlice";
import { SequenceModelActions, sequenceModelSelectors } from "../../../../../../../../slices/SequenceModelSlice";
import { EditDecision } from "../../../../../../../../slices/thunks/DecisionThunks";
import { EditSequence } from "../../../../../../../../slices/thunks/SequenceThunks";
import { DavitUtil } from "../../../../../../../../utils/DavitUtil";

export const useDecisionViewModel = () => {
    const decisionToEdit: DecisionTO | null = useSelector(editSelectors.selectDecisionToEdit);
    const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
    const dispatch = useDispatch();
    const [key, setKey] = useState<number>(0);

    useEffect(() => {
        if (DavitUtil.isNullOrUndefined(decisionToEdit)) {
            dispatch(GlobalActions.handleError("Tried to go to edit condition step without conditionToEdit specified"));
            dispatch(EditActions.setMode.edit());
        }
    }, [dispatch, decisionToEdit]);

    const changeName = (name: string) => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            const copyConditionToEdit: DecisionTO = DavitUtil.deepCopy(decisionToEdit);
            copyConditionToEdit.name = name;
            // TODO: das geht einfacher!
            dispatch(EditActions.setMode.editDecision(copyConditionToEdit));
            dispatch(SequenceModelActions.setCurrentSequenceById(copyConditionToEdit.sequenceFk));
        }
    };

    const saveNote = (text: string) => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            const copyConditionToEdit: DecisionTO = DavitUtil.deepCopy(decisionToEdit);
            copyConditionToEdit.note = text;
            dispatch(EditActions.setMode.editDecision(copyConditionToEdit));
            dispatch(SequenceModelActions.setCurrentSequenceById(copyConditionToEdit.sequenceFk));
        }
    };

    const saveDecision = (decision: DecisionTO) => {
        if (!DavitUtil.isNullOrUndefined(decision)) {
            if (decisionToEdit!.name !== "") {
                dispatch(EditDecision.save(decision!));
            }
        }
    };

    const deleteDecision = () => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit) && !DavitUtil.isNullOrUndefined(selectedSequence)) {
            dispatch(EditDecision.delete(decisionToEdit!, selectedSequence!));
            dispatch(EditActions.setMode.editSequence(decisionToEdit!.sequenceFk));
        }
    };

    const updateDecision = (newDecision: DecisionTO) => {
        if (!DavitUtil.isNullOrUndefined(newDecision)) {

            const copyDecision: DecisionTO = DavitUtil.deepCopy(newDecision);
            // TODO: maybe to delete...
            dispatch(EditDecision.save(copyDecision));
            dispatch(EditDecision.update(copyDecision));
        }
    };

    const validStep = (): boolean => {
        let valid: boolean = false;
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            if (decisionToEdit!.name !== "") {
                valid = true;
            }
        }
        return valid;
    };

    const saveGoToType = (ifGoTo: boolean, goTo: GoTo) => {
        if (goTo !== undefined) {
            const copyDecisionToEdit: DecisionTO = DavitUtil.deepCopy(decisionToEdit);
            ifGoTo ? (copyDecisionToEdit.ifGoTo = goTo) : (copyDecisionToEdit.elseGoTo = goTo);
            updateDecision(copyDecisionToEdit);
            dispatch(SequenceModelActions.setCurrentSequenceById(copyDecisionToEdit.sequenceFk));
        }
    };

    const handleType = (ifGoTo: boolean, newGoToType?: string) => {
        if (newGoToType !== undefined) {
            const gType = {type: (GoToTypes as any)[newGoToType]};
            switch (newGoToType) {
                case GoToTypes.ERROR:
                    saveGoToType(ifGoTo, gType);
                    break;
                case GoToTypes.FIN:
                    saveGoToType(ifGoTo, gType);
                    break;
                case GoToTypes.IDLE:
                    saveGoToType(ifGoTo, gType);
                    break;
                case GoToTypes.STEP:
                    saveGoToType(ifGoTo, gType);
                    break;
                case GoToTypes.DEC:
                    saveGoToType(ifGoTo, gType);
                    break;
            }
        }
    };

    const setGoToTypeStep = (ifGoTo: boolean, step?: SequenceStepCTO) => {
        if (step) {
            const newGoTo: GoTo = {type: GoToTypes.STEP, id: step.sequenceStepTO.id};
            saveGoToType(ifGoTo, newGoTo);
        }
    };

    const setGoToTypeDecision = (ifGoTo: boolean, decision?: DecisionTO) => {
        if (decision) {
            const newGoTo: GoTo = {type: GoToTypes.DEC, id: decision.id};
            saveGoToType(ifGoTo, newGoTo);
        }
    };

    const createGoToStep = (ifGoTo: boolean) => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            const goToStep: SequenceStepCTO = new SequenceStepCTO();
            goToStep.sequenceStepTO.sequenceFk = decisionToEdit!.sequenceFk;
            const copyDecision: DecisionTO = DavitUtil.deepCopy(decisionToEdit);
            dispatch(EditActions.setMode.editStep(goToStep, copyDecision, ifGoTo));
        }
    };

    const createGoToDecision = (ifGoTo: boolean) => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            const goToDecision: DecisionTO = new DecisionTO();
            goToDecision.sequenceFk = decisionToEdit!.sequenceFk;
            const copyStepToEdit: SequenceStepCTO = DavitUtil.deepCopy(decisionToEdit);
            dispatch(EditActions.setMode.editDecision(goToDecision, copyStepToEdit, ifGoTo));
            setKey(key + 1);
        }
    };

    const setRoot = () => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            dispatch(EditSequence.setRoot(decisionToEdit!.sequenceFk, decisionToEdit!.id, true));
            dispatch(EditActions.setMode.editDecision(EditDecision.find(decisionToEdit!.id)));
        }
    };


    const checkGoTos = (goto: GoTo): GoTo => {
        const copyGoto: GoTo = DavitUtil.deepCopy(goto);

        if ((goto.type === GoToTypes.STEP || goto.type === GoToTypes.DEC) && (goto.id === -1 || goto.id === undefined)) {
            copyGoto.type = GoToTypes.ERROR;
        }

        return copyGoto;
    };

    const saveAndGoBack = () => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit) && !DavitUtil.isNullOrUndefined(selectedSequence)) {
            const copyDecision: DecisionTO = DavitUtil.deepCopy(decisionToEdit);
            if (copyDecision!.name !== "") {
                copyDecision.ifGoTo = checkGoTos(copyDecision.ifGoTo);
                copyDecision.elseGoTo = checkGoTos(copyDecision.elseGoTo);

                dispatch(EditDecision.save(copyDecision!));
                dispatch(EditActions.setMode.editSequence(selectedSequence!.sequenceTO.id));
            } else {
                deleteDecision();
            }
        }
    };

    // ------------------------------------- Condition ------------------------------------

    const createCondition = () => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            const copyDecision: DecisionTO = DavitUtil.deepCopy(decisionToEdit);
            copyDecision.conditions.push({
                decisionFk: copyDecision.id,
                id: -1,
                actorFk: -1,
                instanceFk: -1,
                dataFk: -1,
            });
            updateDecision(copyDecision);

        }
    };

    const deleteCondition = (conditionId: number) => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            const copyDecision: DecisionTO = DavitUtil.deepCopy(decisionToEdit);
            copyDecision.conditions = copyDecision.conditions.filter(condition => condition.id !== conditionId);
            updateDecision(copyDecision);
        }
    };

    const saveCondition = (conditionToSave: ConditionTO) => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            const copyDecision: DecisionTO = DavitUtil.deepCopy(decisionToEdit);
            // TODO: ConditonThunk soll das machen.
            let conditionToUpdate: ConditionTO | undefined = copyDecision.conditions.find(condition => condition.id === conditionToSave.id);
            if (conditionToUpdate) {
                let filteredConditions: ConditionTO[] = copyDecision.conditions.filter(condition => condition.id !== conditionToSave.id);
                filteredConditions.push(conditionToSave);
                copyDecision.conditions = filteredConditions;
            } else {
                copyDecision.conditions.push(conditionToSave);
            }
            updateDecision(copyDecision);
        }
    };

    // ------------------------------------- State ------------------------------------

    const updateStateFkAndStateCondition = (newState: StateFkAndStateCondition | undefined, index: number) => {
        if (newState) {
            if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
                const copyDecision: DecisionTO = DavitUtil.deepCopy(decisionToEdit);
                copyDecision.stateFkAndStateConditions[index] = newState;
                updateDecision(copyDecision);
            }
        }
    };

    const createStateFkAndStateCondition = () => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            const copyDecision: DecisionTO = DavitUtil.deepCopy(decisionToEdit);
            copyDecision.stateFkAndStateConditions.push({stateFk: -1, stateCondition: true});

            updateDecision(copyDecision);
        }
    };

    const deleteStateFkAndStateCondition = (stateFkToRemove: number) => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            const copyDecision: DecisionTO = DavitUtil.deepCopy(decisionToEdit);
            copyDecision.stateFkAndStateConditions = copyDecision.stateFkAndStateConditions.filter(stateFkStateCondition => stateFkStateCondition.stateFk !== stateFkToRemove);
            updateDecision(copyDecision);
        }
    };

    return {
        label: "EDIT * " + (selectedSequence?.sequenceTO.name || "") + " * " + (decisionToEdit?.name || ""),
        name: decisionToEdit?.name,
        changeName,
        saveDecision,
        validStep,
        updateDecision,
        deleteDecision,
        handleType,
        setGoToTypeStep,
        setGoToTypeDecision,
        ifGoTo: decisionToEdit?.ifGoTo,
        elseGoTo: decisionToEdit?.elseGoTo,
        createGoToStep,
        createGoToDecision,
        setRoot,
        isRoot: decisionToEdit?.root ? decisionToEdit.root : false,
        key,
        createCondition,
        decId: decisionToEdit?.id,
        conditions: decisionToEdit?.conditions || [],
        note: decisionToEdit ? decisionToEdit.note : "",
        saveNote,
        deleteCondition,
        saveCondition,
        saveAndGoBack,
        stateFkAndStateConditions: decisionToEdit?.stateFkAndStateConditions || [],
        deleteStateFkAndStateCondition,
        createStateFkAndStateCondition,
        updateStateFkAndStateCondition,
        sequenceFk: decisionToEdit?.sequenceFk || -1,
    };
};
