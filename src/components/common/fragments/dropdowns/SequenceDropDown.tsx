import React, { FunctionComponent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { SequenceTO } from "../../../../dataAccess/access/to/SequenceTO";
import { masterDataSelectors } from "../../../../slices/MasterDataSlice";

interface SequenceDropDownProps extends DropdownProps {
  onSelect: (sequence: SequenceTO | undefined) => void;
  placeholder?: string;
  value?: number;
}

interface SequenceDropDownPropsButton extends DropdownProps {
  onSelect: (sequence: SequenceTO | undefined) => void;
  icon?: string;
}

export const SequenceDropDown: FunctionComponent<SequenceDropDownProps> = (props) => {
  const { onSelect, placeholder, value } = props;
  const { sequences, selectSequence, sequenceToOption, isEmpty } = useSequenceDropDownViewModel();

  return (
    <Dropdown
      options={sequences.map(sequenceToOption)}
      placeholder={placeholder || "Select Sequence ..."}
      onChange={(event, sequence) => onSelect(selectSequence(Number(sequence.value), sequences))}
      floating
      selectOnBlur={false}
      scrolling
      clearable
      selection
      value={value}
      disabled={isEmpty}
    />
  );
};

export const SequenceDropDownButton: FunctionComponent<SequenceDropDownPropsButton> = (props) => {
  const { onSelect, icon } = props;
  const { sequences, selectSequence, sequenceToOption, isEmpty } = useSequenceDropDownViewModel();

  return (
    <Dropdown
      options={sequences.map(sequenceToOption)}
      icon={isEmpty ? "" : icon}
      onChange={(event, sequence) => onSelect(selectSequence(Number(sequence.value), sequences))}
      className="button icon"
      inverted="true"
      color="orange"
      floating
      selectOnBlur={false}
      trigger={<React.Fragment />}
      scrolling
      disabled={isEmpty}
    />
  );
};

const useSequenceDropDownViewModel = () => {
  const sequences: SequenceTO[] = useSelector(masterDataSelectors.sequences);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);

  useEffect(() => {
    sequences.length > 0 ? setIsEmpty(false) : setIsEmpty(true);
  }, [sequences]);

  const selectSequence = (sequenceId: number, sequences: SequenceTO[]): SequenceTO | undefined => {
    if (!isNullOrUndefined(sequenceId) && !isNullOrUndefined(sequences)) {
      return sequences.find((sequence) => sequence.id === sequenceId);
    }
    return undefined;
  };

  const sequenceToOption = (sequence: SequenceTO): DropdownItemProps => {
    return {
      key: sequence.id,
      value: sequence.id,
      text: sequence.name,
    };
  };

  return { sequences, selectSequence, sequenceToOption, isEmpty };
};