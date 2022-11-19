import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChainDecisionTO } from "../../../../../../../../dataAccess/access/to/ChainDecisionTO";
import { ChainLinkTO } from "../../../../../../../../dataAccess/access/to/ChainlinkTO";
import { ChainTO } from "../../../../../../../../dataAccess/access/to/ChainTO";
import { SequenceConfigurationTO } from "../../../../../../../../dataAccess/access/to/SequenceConfigurationTO";
import { SequenceTO } from "../../../../../../../../dataAccess/access/to/SequenceTO";
import { GoToChain, GoToTypesChain } from "../../../../../../../../dataAccess/access/types/GoToTypeChain";
import { EditActions, editSelectors } from "../../../../../../../../slices/EditSlice";
import { GlobalActions } from "../../../../../../../../slices/GlobalSlice";
import { sequenceModelSelectors } from "../../../../../../../../slices/SequenceModelSlice";
import { EditChainLink } from "../../../../../../../../slices/thunks/ChainLinkThunks";
import { EditChain } from "../../../../../../../../slices/thunks/ChainThunks";
import { useAppDispatch } from "../../../../../../../../store";
import { DavitUtil } from "../../../../../../../../utils/DavitUtil";

export const useChainLinkViewModel = () => {
    const chainLinkToEdit: ChainLinkTO | null = useSelector(editSelectors.selectChainLinkToEdit);
    const selectedChain: ChainTO | null = useSelector(sequenceModelSelectors.selectChain);
    const dispatch = useAppDispatch();
    const [currentGoTo, setCurrentGoTo] = useState<GoToChain>({type: GoToTypesChain.LINK, id: -1});

    useEffect(() => {
        if (DavitUtil.isNullOrUndefined(chainLinkToEdit)) {
            dispatch(GlobalActions.handleError("Tried to go to edit sequence step without sequenceStepToEdit specified"));
            dispatch(EditActions.setMode.edit());
        }
        if (chainLinkToEdit) {
            setCurrentGoTo(chainLinkToEdit.goto);
        }
    }, [dispatch, chainLinkToEdit]);

    const changeName = (name: string) => {
        if (!DavitUtil.isNullOrUndefined(chainLinkToEdit)) {
            const copyChainLink: ChainLinkTO = DavitUtil.deepCopy(chainLinkToEdit);
            copyChainLink.name = name;
            dispatch(EditChainLink.save(copyChainLink));
            dispatch(EditActions.setMode.editChainLink(copyChainLink));
        }
    };

    const saveChainLink = (newMode?: string) => {
        if (!DavitUtil.isNullOrUndefined(chainLinkToEdit) && !DavitUtil.isNullOrUndefined(selectedChain)) {
            if (chainLinkToEdit!.name !== "") {
                dispatch(EditChainLink.save(chainLinkToEdit!));
            } else {
                dispatch(EditChainLink.delete(chainLinkToEdit!));
            }
            if (newMode && newMode === "EDIT") {
                dispatch(EditActions.setMode.edit());
            } else {
                dispatch(EditActions.setMode.editChain(selectedChain!));
            }
        }
    };

    const deleteChainLink = () => {
        if (!DavitUtil.isNullOrUndefined(chainLinkToEdit) && !DavitUtil.isNullOrUndefined(selectedChain)) {
            dispatch(EditChainLink.delete(chainLinkToEdit!));
            dispatch(EditActions.setMode.editChain(selectedChain!));
        }
    };

    const saveGoToType = (goTo: GoToChain) => {
        if (goTo !== undefined && !DavitUtil.isNullOrUndefined(chainLinkToEdit)) {
            const copyChainlink: ChainLinkTO = DavitUtil.deepCopy(chainLinkToEdit);
            copyChainlink.goto = goTo;
            dispatch(EditChainLink.save(copyChainlink!));
            dispatch(EditActions.setMode.editChainLink(copyChainlink));
        }
    };

    const handleType = (newGoToType?: string) => {
        if (newGoToType !== undefined) {
            const gType = {type: (GoToTypesChain as any)[newGoToType]};
            setCurrentGoTo(gType);
            switch (newGoToType) {
                case GoToTypesChain.ERROR:
                    saveGoToType(gType);
                    break;
                case GoToTypesChain.FIN:
                    saveGoToType(gType);
                    break;
            }
        }
    };

    const setNextLink = (link?: ChainLinkTO) => {
        if (link) {
            const newGoTo: GoToChain = {type: GoToTypesChain.LINK, id: link.id};
            saveGoToType(newGoTo);
        }
    };

    const setNextDecision = (decision?: ChainDecisionTO) => {
        if (decision) {
            const newGoTo: GoToChain = {type: GoToTypesChain.DEC, id: decision.id};
            saveGoToType(newGoTo);
        }
    };

    const createNewChainLink = () => {
        if (!DavitUtil.isNullOrUndefined(chainLinkToEdit)) {
            const copyChainLinkToEdit: ChainLinkTO = DavitUtil.deepCopy(chainLinkToEdit);
            const newChainLink: ChainLinkTO = new ChainLinkTO();
            newChainLink.chainFk = chainLinkToEdit!.chainFk;
            dispatch(EditActions.setMode.editChainLink(newChainLink, copyChainLinkToEdit));
        }
    };

    const createGoToDecision = () => {
        if (!DavitUtil.isNullOrUndefined(chainLinkToEdit)) {
            const copyLinkToEdit: ChainDecisionTO = DavitUtil.deepCopy(chainLinkToEdit);
            const goToDecision: ChainDecisionTO = new ChainDecisionTO();
            goToDecision.chainFk = chainLinkToEdit!.chainFk;
            dispatch(EditActions.setMode.editChainDecision(goToDecision, copyLinkToEdit));
        }
    };

    const setDataSetup = (sequenceConfigurationTO?: SequenceConfigurationTO) => {
        if (!DavitUtil.isNullOrUndefined(chainLinkToEdit)) {
            const copyChainLinkToEdit: ChainLinkTO = DavitUtil.deepCopy(chainLinkToEdit);
            if (sequenceConfigurationTO) {
                copyChainLinkToEdit.sequenceConfigurationFk = sequenceConfigurationTO.id;
            } else {
                copyChainLinkToEdit.sequenceConfigurationFk = -1;
            }
            dispatch(EditChainLink.save(copyChainLinkToEdit));
            dispatch(EditActions.setMode.editChainLink(copyChainLinkToEdit));
        }
    };

    const setSequenceModel = (sequence?: SequenceTO) => {
        if (!DavitUtil.isNullOrUndefined(chainLinkToEdit)) {
            const copyChainLinkToEdit: ChainLinkTO = DavitUtil.deepCopy(chainLinkToEdit);
            if (sequence) {
                copyChainLinkToEdit.sequenceFk = sequence.id;
            } else {
                copyChainLinkToEdit.sequenceFk = -1;
            }
            dispatch(EditChainLink.save(copyChainLinkToEdit));
            dispatch(EditActions.setMode.editChainLink(copyChainLinkToEdit));
        }
    };

    const setRoot = () => {
        if (!DavitUtil.isNullOrUndefined(chainLinkToEdit)) {
            dispatch(EditChain.setRoot(chainLinkToEdit!.chainFk, chainLinkToEdit!.id, false));
            dispatch(EditActions.setMode.editChainLink(EditChainLink.find(chainLinkToEdit!.id)));
        }
    };

    return {
        label: "EDIT * " + (selectedChain?.name || "") + " * " + (chainLinkToEdit?.name || ""),
        name: chainLinkToEdit ? chainLinkToEdit.name : "",
        changeName,
        saveChainLink,
        deleteChainLink,
        goTo: currentGoTo,
        isRoot: chainLinkToEdit?.root ? chainLinkToEdit.root : false,
        stepId: chainLinkToEdit?.id,
        currentSequenceConfiguration: chainLinkToEdit?.sequenceConfigurationFk,
        currentSequence: chainLinkToEdit?.sequenceFk,
        setDataSetup,
        setSequenceModel,
        linkId: chainLinkToEdit?.id,
        chainId: chainLinkToEdit?.chainFk || -1,
        handleType,
        setNextLink,
        setNextDecision,
        createNewChainLink,
        createGoToDecision,
        setRoot,
        id: chainLinkToEdit?.id || -1,
    };
};
