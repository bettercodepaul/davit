import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { DecisionTO } from "../../../dataAccess/access/to/DecisionTO";
import { sequenceModelSelectors } from "../../../slices/SequenceModelSlice";
import { DavitUtil } from "../../../utils/DavitUtil";
import { DavitDropDown, DavitDropDownItemProps, DavitLabelDropDown } from "./DavitDropDown";

interface DecisionLabelDropDownProps {
    onSelect: (decision: DecisionTO | undefined) => void;
    label: string;
}

interface DecisionDropDownProps {
    onSelect: (decision: DecisionTO | undefined) => void;
    placeholder?: string;
    value?: number;
    exclude?: number;
}

export const DecisionLabelDropDown: FunctionComponent<DecisionLabelDropDownProps> = (props) => {
    const {onSelect, label} = props;
    const {sequenceToEdit, decisionOptions, selectDecision} = useDecisionDropDownViewModel();

    return (
        <DavitLabelDropDown
            dropdownItems={decisionOptions()}
            onSelect={(decision) => onSelect(selectDecision(Number(decision.value), sequenceToEdit))}
            label={label}
        />
    );
};

export const DecisionDropDown: FunctionComponent<DecisionDropDownProps> = (props) => {
    const {onSelect, placeholder, value, exclude} = props;
    const {sequenceToEdit, decisionOptions, selectDecision} = useDecisionDropDownViewModel(exclude);

    return (
        <DavitDropDown
            dropdownItems={decisionOptions()}
            placeholder={placeholder}
            onSelect={(decision) => onSelect(selectDecision(Number(decision.value), sequenceToEdit))}
            value={value?.toString()}
        />
    );
};

const useDecisionDropDownViewModel = (exclude?: number) => {
    const sequenceToEdit: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);

    const decisionToOption = (decision: DecisionTO): DavitDropDownItemProps => {
        return {
            key: decision.id,
            value: decision.id.toString(),
            text: decision.name,
        };
    };

    const decisionOptions = (): DavitDropDownItemProps[] => {
        if (!DavitUtil.isNullOrUndefined(sequenceToEdit)) {
            let copyDec: DecisionTO[] = DavitUtil.deepCopy(sequenceToEdit!.decisions);
            if (exclude) {
                copyDec = copyDec.filter((dec) => dec.id !== exclude);
            }
            return copyDec.map(decisionToOption);
        }
        return [];
    };

    const selectDecision = (decisionId: number, sequence: SequenceCTO | null): DecisionTO | undefined => {
        if (!DavitUtil.isNullOrUndefined(sequence) && !DavitUtil.isNullOrUndefined(decisionId)) {
            return sequence!.decisions.find((decision) => decision.id === decisionId);
        }
        return undefined;
    };

    return {sequenceToEdit, decisionOptions, selectDecision};
};
