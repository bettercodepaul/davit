import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { sequenceModelSelectors } from "../../../slices/SequenceModelSlice";
import { DavitUtil } from "../../../utils/DavitUtil";
import { DavitDropDown, DavitDropDownItemProps, DavitLabelDropDown } from "./DavitDropDown";

interface StepLabelDropDownProps {
    onSelect: (step: SequenceStepCTO | undefined) => void;
    label: string;
}

interface StepDropDownProps {
    onSelect: (step: SequenceStepCTO | undefined) => void;
    placeholder?: string;
    value?: number;
    exclude?: number;
}

export const StepLabelDropDown: FunctionComponent<StepLabelDropDownProps> = (props) => {
    const {onSelect, label} = props;
    const {sequence, stepOptions, selectSequenceStep} = useStepDropDownViewModel();

    return (
        <DavitLabelDropDown
            dropdownItems={stepOptions()}
            label={label}
            onSelect={(step) => onSelect(selectSequenceStep(Number(step.value), sequence))}
        />
    );
};

export const StepDropDown: FunctionComponent<StepDropDownProps> = (props) => {
    const {onSelect, placeholder, value, exclude} = props;
    const {sequence, stepOptions, selectSequenceStep} = useStepDropDownViewModel(exclude);

    return (
        <DavitDropDown
            dropdownItems={stepOptions()}
            placeholder={placeholder}
            onSelect={(step) => onSelect(selectSequenceStep(Number(step.value), sequence))}
            value={value === -1 ? undefined : value?.toString()}
        />
    );
};

const useStepDropDownViewModel = (exclude?: number) => {
    const sequenceToEdit: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);

    const stepToOption = (step: SequenceStepCTO): DavitDropDownItemProps => {
        return {
            key: step.sequenceStepTO.id,
            value: step.sequenceStepTO.id.toString(),
            text: step.sequenceStepTO.name,
        };
    };

    const stepOptions = (): DavitDropDownItemProps[] => {
        if (!DavitUtil.isNullOrUndefined(sequenceToEdit)) {
            let copySteps: SequenceStepCTO[] = DavitUtil.deepCopy(sequenceToEdit!.sequenceStepCTOs);
            if (exclude) {
                copySteps = copySteps.filter((step) => step.sequenceStepTO.id !== exclude);
            }
            return copySteps.map(stepToOption);
        }
        return [];
    };

    const selectSequenceStep = (stepId: number, sequence: SequenceCTO | null): SequenceStepCTO | undefined => {
        if (!DavitUtil.isNullOrUndefined(sequence) && !DavitUtil.isNullOrUndefined(stepId)) {
            return sequence!.sequenceStepCTOs.find((step) => step.sequenceStepTO.id === stepId);
        }
        return undefined;
    };

    return {sequence: sequenceToEdit, stepOptions, selectSequenceStep};
};
