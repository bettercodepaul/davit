import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { SequenceStateTO } from "../../../dataAccess/access/to/SequenceStateTO";
import { masterDataSelectors } from "../../../slices/MasterDataSlice";
import { DavitDropDown, DavitDropDownItemProps } from "./DavitDropDown";

interface SequenceStateDropDownProps {
    onSelect: (sequenceState: SequenceStateTO | undefined) => void;
    sequenceFk: number;
    placeholder?: string;
    value?: string;
}

export const SequenceStateDropDown: FunctionComponent<SequenceStateDropDownProps> = (props) => {
    const {onSelect, placeholder, value, sequenceFk} = props;
    const sequenceStates: SequenceStateTO[] = useSelector(masterDataSelectors.selectSequenceStateBySequenceId(sequenceFk));

    const sequenceStateToDavitDropDownItem = (sequenceState: SequenceStateTO): DavitDropDownItemProps => {
        return {key: sequenceState.id, value: sequenceState.id.toString(), text: sequenceState.label};
    };

    return (
        <DavitDropDown
            dropdownItems={sequenceStates.map(sequenceStateToDavitDropDownItem)}
            onSelect={(item) => onSelect(sequenceStates.find(state => state.id === Number(item.value)))}
            placeholder={placeholder}
            value={value}
        />
    );

};

