import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { SequenceCTO } from "../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../dataAccess/access/cto/SequenceStepCTO";
import { sequenceModelSelectors } from "../../../../slices/SequenceModelSlice";

interface StepDropDownProps extends DropdownProps {
  onSelect: (step: SequenceStepCTO | undefined) => void;
  icon?: string;
}

export const StepDropDown: FunctionComponent<StepDropDownProps> = (props) => {
  const { onSelect, icon } = props;
  const { sequence, stepOptions, selectSequenceStep } = useStepDropDownViewModel();

  return (
    <Dropdown
      options={stepOptions(sequence)}
      icon={icon}
      onChange={(event, data) => onSelect(selectSequenceStep(Number(data.value), sequence))}
      className="button icon"
      floating
      selectOnBlur={false}
      trigger={<React.Fragment />}
      scrolling
    />
  );
};

const useStepDropDownViewModel = () => {
  const sequenceToEdit: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);

  const stepToOption = (step: SequenceStepCTO): DropdownItemProps => {
    return {
      key: step.squenceStepTO.id,
      value: step.squenceStepTO.id,
      text: step.squenceStepTO.name,
    };
  };

  const stepOptions = (sequence: SequenceCTO | null): DropdownItemProps[] => {
    if (!isNullOrUndefined(sequence)) {
      return sequence.sequenceStepCTOs.map(stepToOption);
    }
    return [];
  };

  const selectSequenceStep = (stepId: number, sequence: SequenceCTO | null): SequenceStepCTO | undefined => {
    if (!isNullOrUndefined(sequence) && !isNullOrUndefined(stepId)) {
      return sequence.sequenceStepCTOs.find((step) => step.squenceStepTO.id === stepId);
    }
    return undefined;
  };

  return { sequence: sequenceToEdit, stepOptions, selectSequenceStep };
};
