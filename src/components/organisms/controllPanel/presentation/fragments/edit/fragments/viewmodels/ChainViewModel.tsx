import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ChainDecisionTO } from "../../../../../../../../dataAccess/access/to/ChainDecisionTO";
import { ChainLinkTO } from "../../../../../../../../dataAccess/access/to/ChainlinkTO";
import { ChainStateTO } from "../../../../../../../../dataAccess/access/to/ChainStateTO";
import { ChainTO } from "../../../../../../../../dataAccess/access/to/ChainTO";
import { SequenceTO } from "../../../../../../../../dataAccess/access/to/SequenceTO";
import { EditActions } from "../../../../../../../../slices/EditSlice";
import { masterDataSelectors } from "../../../../../../../../slices/MasterDataSlice";
import { sequenceModelSelectors } from "../../../../../../../../slices/SequenceModelSlice";
import { EditChainState } from "../../../../../../../../slices/thunks/ChainStateThunk";
import { EditChain } from "../../../../../../../../slices/thunks/ChainThunks";
import { EditSequence } from "../../../../../../../../slices/thunks/SequenceThunks";
import { useAppDispatch } from "../../../../../../../../store";
import { DavitUtil } from "../../../../../../../../utils/DavitUtil";

export const useChainViewModel = () => {
    const selectedChain: ChainTO | null = useSelector(sequenceModelSelectors.selectChain);
    const dispatch = useAppDispatch();
    const [isCreateAnother, setIsCreateAnother] = useState<boolean>(false);
    const isFirst: boolean = useSelector(masterDataSelectors.isFirstChainElement(selectedChain?.id || -1));

    useEffect(() => {
        // check if sequence to edit is really set or gos back to edit mode
        if (DavitUtil.isNullOrUndefined(selectedChain)) {
            console.warn("Tried to go to edit sequence without chain specified" + selectedChain);
            dispatch(EditActions.setMode.edit());
        }
        if (selectedChain?.id !== -1) {
            setIsCreateAnother(false);
        }
    }, [selectedChain, dispatch]);

    const changeName = (name: string) => {
        if (!DavitUtil.isNullOrUndefined(selectedChain)) {
            const copyChainToEdit: ChainTO = DavitUtil.deepCopy(selectedChain);
            copyChainToEdit.name = name;
            dispatch(EditChain.save(copyChainToEdit));
        }
    };

    const saveChain = (newMode?: string) => {
        if (!DavitUtil.isNullOrUndefined(selectedChain)) {
            if (selectedChain!.name !== "") {
                dispatch(EditChain.save(selectedChain!));
            } else {
                dispatch(EditChain.delete(selectedChain!));
            }
            if (isCreateAnother && !newMode) {
                dispatch(EditActions.setMode.editChain());
            } else {
                dispatch(EditActions.setMode.edit());
            }
        }
    };

    const deleteChain = () => {
        if (!DavitUtil.isNullOrUndefined(selectedChain)) {
            dispatch(EditChain.delete(selectedChain!));
        }
        dispatch(EditActions.setMode.edit());
    };

    const validateInput = (): boolean => {
        if (!DavitUtil.isNullOrUndefined(selectedChain)) {
            return DavitUtil.isValidName(selectedChain!.name);
        } else {
            return false;
        }
    };

    const editOrAddChainLink = (link?: ChainLinkTO) => {
        let chainLinkToEdit: ChainLinkTO | undefined = link;
        if (chainLinkToEdit === undefined) {
            chainLinkToEdit = new ChainLinkTO();
            chainLinkToEdit.chainFk = selectedChain?.id || -1;
            chainLinkToEdit.root = isFirst;
        }
        dispatch(EditActions.setMode.editChainLink(chainLinkToEdit));
    };

    const editOrAddChainDecision = (decision?: ChainDecisionTO) => {
        let decisionToEdit: ChainDecisionTO | undefined = decision;
        if (decisionToEdit === undefined) {
            decisionToEdit = new ChainDecisionTO();
            decisionToEdit.chainFk = selectedChain?.id || -1;
        }
        dispatch(EditActions.setMode.editChainDecision(decisionToEdit));
    };

    const createAnother = () => {
        dispatch(EditActions.setMode.editChain());
    };

    const updateSequence = () => {
        const copySequence: SequenceTO = DavitUtil.deepCopy(selectedChain);
        dispatch(EditSequence.save(copySequence));
    };

    // ---------------------- STATE ----------------------

    const saveStateFkAndStateCondition = (stateToSave: ChainStateTO) => {
        dispatch(EditChainState.save(stateToSave));
    };

    const createStateFkAndStateCondition = () => {
        if (!DavitUtil.isNullOrUndefined(selectedChain)) {
            const newChainState: ChainStateTO = new ChainStateTO();
            newChainState.chainFk = selectedChain!.id;
            saveStateFkAndStateCondition(newChainState);
        }
    };

    const deleteStateFkAndStateCondition = (stateToDeleteId: number) => {
        dispatch(EditChainState.delete(stateToDeleteId));
    };

    const editChain = () => {
        if (!DavitUtil.isNullOrUndefined(selectedChain)) {
            dispatch(EditActions.setMode.editChain(selectedChain!));
        }
    };

    const editStates = () => {
        if (!DavitUtil.isNullOrUndefined(selectedChain)) {
            dispatch(EditActions.setMode.editChainStates());
        }
    };

    const saveNote = (note: string) => {
        if (!DavitUtil.isNullOrUndefined(selectedChain)) {
            const copyChain: ChainTO = DavitUtil.deepCopy(selectedChain);
            copyChain.note = note;
            dispatch(EditChain.save(copyChain));
        }
    };

    return {
        label: "EDIT * " + (selectedChain?.name || ""),
        name: selectedChain?.name,
        id: selectedChain?.id ? selectedChain.id : -1,
        changeName,
        saveChain,
        deleteChain,
        validateInput,
        createAnother,
        updateSequence,
        editOrAddChainDecision,
        editOrAddChainLink,
        editStates,
        editChain,
        saveStateFkAndStateCondition,
        createStateFkAndStateCondition,
        deleteStateFkAndStateCondition,
        note: selectedChain?.note || "",
        saveNote,
    };
};
