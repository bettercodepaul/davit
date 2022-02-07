import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { SequenceTO } from "../../../dataAccess/access/to/SequenceTO";
import { masterDataSelectors } from "../../../slices/MasterDataSlice";
import { DavitUtil } from "../../../utils/DavitUtil";
import { DavitDropDown, DavitDropDownItemProps, DavitLabelDropDown } from "./DavitDropDown";

interface SequenceDropDownProps {
    onSelect: (sequence: SequenceTO | undefined) => void;
    placeholder?: string;
    value?: number;
}

interface SequenceLabelDropDownProps {
    onSelect: (sequence: SequenceTO | undefined) => void;
    label: string;
}

export const SequenceDropDown: FunctionComponent<SequenceDropDownProps> = (props) => {
    const {onSelect, placeholder, value} = props;
    const {sequences, selectSequence, sequenceToOption} = useSequenceDropDownViewModel();

    return (
        <DavitDropDown
            dropdownItems={sequences.map(sequenceToOption)}
            placeholder={placeholder}
            onSelect={(sequence) => onSelect(selectSequence(Number(sequence.value), sequences))}
            value={value?.toString()}
            clearable={true}
        />
    );
};

export const SequenceLabelDropDown: FunctionComponent<SequenceLabelDropDownProps> = (props) => {
    const {onSelect, label} = props;
    const {sequences, selectSequence, sequenceToOption} = useSequenceDropDownViewModel();

    return (
        <DavitLabelDropDown
            dropdownItems={sequences.map(sequenceToOption)}
            label={label}
            onSelect={(sequence) => onSelect(selectSequence(Number(sequence.value), sequences))}
        />
    );
};

const useSequenceDropDownViewModel = () => {
    const sequences: SequenceTO[] = useSelector(masterDataSelectors.selectSequences);

    const selectSequence = (sequenceId: number, sequences: SequenceTO[]): SequenceTO | undefined => {
        if (!DavitUtil.isNullOrUndefined(sequenceId) && !DavitUtil.isNullOrUndefined(sequences)) {
            return sequences.find((sequence) => sequence.id === sequenceId);
        }
        return undefined;
    };

    const sequenceToOption = (sequence: SequenceTO): DavitDropDownItemProps => {
        return {
            key: sequence.id,
            value: sequence.id.toString(),
            text: sequence.name,
        };
    };

    return {sequences, selectSequence, sequenceToOption};
};
