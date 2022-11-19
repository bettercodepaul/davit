
import { useSelector } from "react-redux";
import { SequenceCTO } from "../../../../../../../dataAccess/access/cto/SequenceCTO";
import { ChainTO } from "../../../../../../../dataAccess/access/to/ChainTO";
import { SequenceTO } from "../../../../../../../dataAccess/access/to/SequenceTO";
import { EditActions } from "../../../../../../../slices/EditSlice";
import {
    SequenceModelActions,
    sequenceModelSelectors,
    ViewLevel
} from "../../../../../../../slices/SequenceModelSlice";
import { useAppDispatch } from "../../../../../../../store";
import { DavitUtil } from "../../../../../../../utils/DavitUtil";

export const useViewViewModel = () => {
    const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
    const stepIndex: number | null = useSelector(sequenceModelSelectors.selectCurrentStepIndex);
    const selectedChain: ChainTO | null = useSelector(sequenceModelSelectors.selectChain);
    const linkIndex: number | null = useSelector(sequenceModelSelectors.selectCurrentLinkIndex);
    const viewLevel: ViewLevel = useSelector(sequenceModelSelectors.selectViewLevel);
    const dispatch = useAppDispatch();

    const selectSequence = (sequence: SequenceTO | undefined) => {
        if (!DavitUtil.isNullOrUndefined(sequence)) {
            dispatch(SequenceModelActions.setCurrentSequenceById(sequence!.id));
        }
        if (sequence === undefined) {
            dispatch(SequenceModelActions.resetCurrentStepIndex);
            dispatch(SequenceModelActions.resetCurrentSequence);
        }
    };

    const selectChain = (chain: ChainTO | undefined) => {
        if (!DavitUtil.isNullOrUndefined(chain)) {
            dispatch(SequenceModelActions.setCurrentChain(chain!));
        }
        if (chain === undefined) {
            dispatch(SequenceModelActions.resetCurrentStepIndex);
            dispatch(SequenceModelActions.resetCurrentChain);
        }
    };

    const getSequenceNote = (): string => {
        let note: string = "";
        if (!DavitUtil.isNullOrUndefined(selectedSequence)) {
            note = selectedSequence!.sequenceTO.note;
        }
        return note;
    };

    const getChainNote = (): string => {
        let note: string = "";
        if (!DavitUtil.isNullOrUndefined(selectedChain)) {
            note = selectedChain!.note;
        }
        return note;
    };

    return {
        sequence: selectedSequence,
        stepIndex,
        linkIndex,
        selectSequence,
        currentSequence: selectedSequence?.sequenceTO.id || -1,
        currentChain: selectedChain?.id || -1,
        selectChain,
        selectedSequenceName: selectedSequence?.sequenceTO.name || "",
        selectedChainName: selectedChain?.name || "",
        editConfiguration: () => dispatch(EditActions.setMode.editConfiguration()),
        getSequenceNote,
        getChainNote,
        viewLevel,
    };
};