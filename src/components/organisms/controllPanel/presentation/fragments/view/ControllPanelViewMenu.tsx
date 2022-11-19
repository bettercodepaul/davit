import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataSetupCTO } from "../../../../../../dataAccess/access/cto/DataSetupCTO";
import { SequenceCTO } from "../../../../../../dataAccess/access/cto/SequenceCTO";
import { ChainTO } from "../../../../../../dataAccess/access/to/ChainTO";
import { DataSetupTO } from "../../../../../../dataAccess/access/to/DataSetupTO";
import { SequenceTO } from "../../../../../../dataAccess/access/to/SequenceTO";
import { SequenceModelActions, sequenceModelSelectors } from "../../../../../../slices/SequenceModelSlice";
import { useAppDispatch } from "../../../../../../store";
import { DavitUtil } from "../../../../../../utils/DavitUtil";
import { useStepAndLinkNavigation } from "../../../../../../utils/WindowUtil";
import { ChainDropDown } from "../../../../../atomic/dropdowns/ChainDropDown";
import { DataSetupDropDown } from "../../../../../atomic/dropdowns/DataSetupDropDown";
import { SequenceDropDown } from "../../../../../atomic/dropdowns/SequenceDropDown";
import { OptionField } from "../edit/common/OptionField";
import { ViewNavigator } from "./fragments/ViewNavigator";

export interface ControlPanelViewMenuProps {
    hidden: boolean;
}

export const ControlPanelViewMenu: FunctionComponent<ControlPanelViewMenuProps> = () => {

    const {
        stepIndex,
        linkIndex,
        selectSequence,
        selectDataSetup,
        currentSequence,
        currentChain,
        selectChain,
    } = useControlPanelViewMenuViewModel();

    const {stepBack, stepNext, linkBack, linkNext} = useStepAndLinkNavigation();

    const getIndex = (): string => {
        const link: string = (linkIndex + 1).toString() || "0";
        const step: string = stepIndex.toString() || "0";
        return link + " / " + step;
    };

    return (
        <div className={"headerGrid"}>

            <OptionField label="Data - Setup">
            </OptionField>

            <OptionField label="SEQUENCE">
                <SequenceDropDown onSelect={selectSequence}
                                  value={currentSequence}
                />
            </OptionField>

            <OptionField label="CHAIN"
                         divider={true}
            >
                <ChainDropDown onSelect={selectChain}
                               value={currentChain}
                />
            </OptionField>

            <OptionField label="STEP"
                         divider={true}
            >
                <ViewNavigator fastBackward={linkBack}
                               fastForward={linkNext}
                               backward={stepBack}
                               forward={stepNext}
                               index={getIndex()}
                />
            </OptionField>

        </div>
    );
};

const useControlPanelViewMenuViewModel = () => {
    const sequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
    const stepIndex: number | null = useSelector(sequenceModelSelectors.selectCurrentStepIndex);
    const selectedChain: ChainTO | null = useSelector(sequenceModelSelectors.selectChain);
    const linkIndex: number | null = useSelector(sequenceModelSelectors.selectCurrentLinkIndex);
    const dispatch = useAppDispatch();

    const selectSequence = (sequence: SequenceTO | undefined) => {
        if (!DavitUtil.isNullOrUndefined(sequence)) {
            // @ts-ignore
            dispatch(SequenceModelActions.setCurrentSequence(sequence!.id));
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

    // TODO: maybe can be removed
    const selectDataSetup = (dataSetup: DataSetupTO | undefined): void => {
        // if (DavitUtil.isNullOrUndefined(dataSetup)) {
        //     dispatch(SequenceModelActions.resetCurrentDataSetup);
        // } else {
        //     dispatch(SequenceModelActions.setCurrentDataSetup(dataSetup!.id));
        // }
    };

    const getSequenceName = (): string => {
        if (sequence) {
            return " * " + sequence.sequenceTO.name;
        } else {
            return "";
        }
    };

    return {
        sequence,
        stepIndex,
        linkIndex,
        selectSequence,
        selectDataSetup,
        currentSequence: sequence?.sequenceTO.id || -1,
        currentChain: selectedChain?.id || -1,
        selectChain,
    };
};
