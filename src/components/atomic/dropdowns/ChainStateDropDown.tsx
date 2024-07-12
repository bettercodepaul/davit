import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { ChainStateTO } from "../../../dataAccess/access/to/ChainStateTO";
import { masterDataSelectors } from "../../../slices/MasterDataSlice";
import { DavitDropDown, DavitDropDownItemProps } from "./DavitDropDown";

interface ChainStateDropDownProps {
    onSelect: (chainState: ChainStateTO | undefined) => void;
    chainFk: number;
    placeholder?: string;
    value?: string;
}

export const ChainStateDropDown: FunctionComponent<ChainStateDropDownProps> = (props) => {
    const {onSelect, placeholder, value, chainFk} = props;
    const chainStates: ChainStateTO[] = useSelector(masterDataSelectors.selectChainStateByChainId(chainFk));

    const chainStateToDavitDropDownItem = (chainState: ChainStateTO): DavitDropDownItemProps => {
        return {key: chainState.id, value: chainState.id.toString(), text: chainState.label};
    };

    return (
        <DavitDropDown
            dropdownItems={chainStates.map(chainStateToDavitDropDownItem)}
            onSelect={(item) => onSelect(chainStates.find(chainState => chainState.id === Number(item.value)))}
            placeholder={placeholder}
            value={value}
        />
    );

};

