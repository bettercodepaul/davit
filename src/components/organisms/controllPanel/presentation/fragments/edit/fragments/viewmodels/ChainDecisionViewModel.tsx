import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChainDecisionTO } from "../../../../../../../../dataAccess/access/to/ChainDecisionTO";
import { ChainLinkTO } from "../../../../../../../../dataAccess/access/to/ChainLinkTO";
import { ChainTO } from "../../../../../../../../dataAccess/access/to/ChainTO";
import { ConditionTO } from "../../../../../../../../dataAccess/access/to/ConditionTO";
import { StateFkAndStateCondition } from "../../../../../../../../dataAccess/access/to/DecisionTO";
import { GoToChain, GoToTypesChain } from "../../../../../../../../dataAccess/access/types/GoToTypeChain";
import { EditActions, editSelectors } from "../../../../../../../../slices/EditSlice";
import { GlobalActions } from "../../../../../../../../slices/GlobalSlice";
import { sequenceModelSelectors } from "../../../../../../../../slices/SequenceModelSlice";
import { EditChainDecision } from "../../../../../../../../slices/thunks/ChainDecisionThunks";
import { DavitUtil } from "../../../../../../../../utils/DavitUtil";

export const useChainDecisionViewModel = () => {
    const decisionToEdit: ChainDecisionTO | null = useSelector(editSelectors.selectChainDecisionToEdit);
    const selectedChain: ChainTO | null = useSelector(sequenceModelSelectors.selectChain);
    const dispatch = useDispatch();
    const [currentIfGoTo, setCurrentIfGoTo] = useState<GoToChain>({type: GoToTypesChain.FIN});
    const [currentElseGoTo, setCurrentElseGoTo] = useState<GoToChain>({type: GoToTypesChain.ERROR});
    const [key, setKey] = useState<number>(0);

    useEffect(() => {
        if (DavitUtil.isNullOrUndefined(decisionToEdit)) {
            dispatch(GlobalActions.handleError("Tried to go to edit condition step without conditionToEdit specified"));
            dispatch(EditActions.setMode.edit());
        }
        if (decisionToEdit) {
            setCurrentIfGoTo(decisionToEdit.ifGoTo);
            setCurrentElseGoTo(decisionToEdit.elseGoTo);
        }
    }, [dispatch, decisionToEdit]);

    const updateChainDecision = (chainDecision: ChainDecisionTO) => {
        if (!DavitUtil.isNullOrUndefined(chainDecision)) {
            dispatch(EditChainDecision.update(chainDecision));
        }
    };

    const changeName = (name: string) => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            const copyDecisionToEdit: ChainDecisionTO = DavitUtil.deepCopy(decisionToEdit);
            copyDecisionToEdit.name = name;
            updateChainDecision(copyDecisionToEdit);
        }
    };

    const goBack = () => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit) && !DavitUtil.isNullOrUndefined(selectedChain)) {
            saveDecision();
            dispatch(EditActions.setMode.editChain(selectedChain!));
        }
    };

    const saveDecision = () => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit) && !DavitUtil.isNullOrUndefined(selectedChain)) {
            if (decisionToEdit!.name !== "") {
                dispatch(EditChainDecision.save(decisionToEdit!));
            } else {
                dispatch(EditChainDecision.delete(decisionToEdit!));
            }
        }
    };


    const deleteDecision = () => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit) && !DavitUtil.isNullOrUndefined(selectedChain)) {
            dispatch(EditChainDecision.delete(decisionToEdit!));
            dispatch(EditActions.setMode.editChain(selectedChain!));
        }
    };


    const saveGoToType = (ifGoTo: boolean, goTo: GoToChain) => {
        if (goTo !== undefined) {
            const copyDecisionToEdit: ChainDecisionTO = DavitUtil.deepCopy(decisionToEdit);
            ifGoTo ? (copyDecisionToEdit.ifGoTo = goTo) : (copyDecisionToEdit.elseGoTo = goTo);
            dispatch(EditChainDecision.save(copyDecisionToEdit));
            dispatch(EditActions.setMode.editChainDecision(copyDecisionToEdit));
        }
    };

    const handleType = (ifGoTo: boolean, newGoToType?: string) => {
        if (newGoToType !== undefined) {
            const gType = {type: (GoToTypesChain as any)[newGoToType]};
            ifGoTo ? setCurrentIfGoTo(gType) : setCurrentElseGoTo(gType);
            switch (newGoToType) {
                case GoToTypesChain.ERROR:
                    saveGoToType(ifGoTo, gType);
                    break;
                case GoToTypesChain.FIN:
                    saveGoToType(ifGoTo, gType);
                    break;
            }
        }
    };

    const setGoToTypeStep = (ifGoTo: boolean, link?: ChainLinkTO) => {
        if (link) {
            const newGoTo: GoToChain = {type: GoToTypesChain.LINK, id: link.id};
            saveGoToType(ifGoTo, newGoTo);
        }
    };

    const setGoToTypeDecision = (ifGoTo: boolean, decision?: ChainDecisionTO) => {
        if (decision) {
            const newGoTo: GoToChain = {type: GoToTypesChain.DEC, id: decision.id};
            saveGoToType(ifGoTo, newGoTo);
        }
    };

    const createGoToLink = (ifGoTo: boolean) => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            const copyDecision: ChainDecisionTO = DavitUtil.deepCopy(decisionToEdit);
            const goToLink: ChainLinkTO = new ChainLinkTO();
            goToLink.chainFk = decisionToEdit!.chainFk;
            dispatch(EditActions.setMode.editChainLink(goToLink, copyDecision, ifGoTo));
        }
    };

    const createGoToDecision = (ifGoTo: boolean) => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            const goToDecision: ChainDecisionTO = new ChainDecisionTO();
            goToDecision.chainFk = decisionToEdit!.chainFk;
            const copyDecisionToEdit: ChainDecisionTO = DavitUtil.deepCopy(decisionToEdit);
            dispatch(EditActions.setMode.editChainDecision(goToDecision, copyDecisionToEdit, ifGoTo));
            setKey(key + 1);
        }
    };

    // ------------------------------------- Condition ------------------------------------

    const createCondition = () => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            const copyDecision: ChainDecisionTO = DavitUtil.deepCopy(decisionToEdit);
            copyDecision.conditions.push({
                decisionFk: copyDecision.id,
                id: copyDecision.conditions.length,
                actorFk: -1,
                instanceFk: -1,
                dataFk: -1,
            });
            updateChainDecision(copyDecision);
        }
    };

    const deleteCondition = (conditionId: number) => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            const copyDecision: ChainDecisionTO = DavitUtil.deepCopy(decisionToEdit);
            copyDecision.conditions = copyDecision.conditions.filter(condition => condition.id !== conditionId);
            updateChainDecision(copyDecision);
        }
    };

    const saveCondition = (conditionToSave: ConditionTO) => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            const copyDecision: ChainDecisionTO = DavitUtil.deepCopy(decisionToEdit);
            // TODO: ConditonThunk soll das machen.
            let conditionToUpdate: ConditionTO | undefined = copyDecision.conditions.find(condition => condition.id === conditionToSave.id);
            if (conditionToUpdate) {
                let filteredConditions: ConditionTO[] = copyDecision.conditions.filter(condition => condition.id !== conditionToSave.id);
                filteredConditions.push(conditionToSave);
                copyDecision.conditions = filteredConditions;
            } else {
                copyDecision.conditions.push(conditionToSave);
            }
            updateChainDecision(copyDecision);
        }
    };

    // ------------------------------------- State ------------------------------------

    const createStateFkAndStateCondition = () => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            const copyDecision: ChainDecisionTO = DavitUtil.deepCopy(decisionToEdit);
            copyDecision.stateFkAndStateConditions.push({stateFk: -1, stateCondition: true});

            updateChainDecision(copyDecision);
        }
    };

    const updateStateFkAndStateCondition = (newState: StateFkAndStateCondition | undefined, index: number) => {
        if (newState) {
            if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
                const copyDecision: ChainDecisionTO = DavitUtil.deepCopy(decisionToEdit);
                copyDecision.stateFkAndStateConditions[index] = newState;
                updateChainDecision(copyDecision);
            }
        }
    };

    const deleteStateFkAndStateCondition = (stateFkToRemove: number) => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            const copyDecision: ChainDecisionTO = DavitUtil.deepCopy(decisionToEdit);
            copyDecision.stateFkAndStateConditions = copyDecision.stateFkAndStateConditions.filter(stateFkStateCondition => stateFkStateCondition.stateFk !== stateFkToRemove);
            updateChainDecision(copyDecision);
        }
    };

    return {
        name: decisionToEdit?.name,
        changeName,
        saveDecision,
        deleteDecision,
        handleType,
        setGoToTypeStep,
        setGoToTypeDecision,
        ifGoTo: currentIfGoTo,
        elseGoTo: currentElseGoTo,
        createGoToStep: createGoToLink,
        createGoToDecision,
        key,
        decId: decisionToEdit?.id,
        chainId: decisionToEdit?.chainFk || -1,
        chainConditions: decisionToEdit?.conditions || [],
        goBack,
        saveCondition,
        deleteCondition,
        createCondition,
        stateFkAndStateConditions: decisionToEdit?.stateFkAndStateConditions || [],
        createStateFkAndStateCondition,
        updateStateFkAndStateCondition,
        deleteStateFkAndStateCondition,
    };
};
