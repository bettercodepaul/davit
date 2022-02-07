import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { ChainDecisionTO } from "../../../dataAccess/access/to/ChainDecisionTO";
import { masterDataSelectors } from "../../../slices/MasterDataSlice";
import { DavitUtil } from "../../../utils/DavitUtil";
import { DavitDropDown, DavitDropDownItemProps, DavitLabelDropDown } from "./DavitDropDown";

interface ChainDecisionDropDownLabelProps {
    onSelect: (link: ChainDecisionTO | undefined) => void;
    chainId: number;
    label: string;
    exclude?: number;
}

interface ChainDecisionDropDownProps {
    onSelect: (link: ChainDecisionTO | undefined) => void;
    chainId: number;
    placeholder?: string;
    value?: number;
    exclude?: number;
}

export const ChainDecisionDropDownButton: FunctionComponent<ChainDecisionDropDownLabelProps> = (props) => {
    const {onSelect, label, chainId, exclude} = props;
    const {createDecisionOptions, selectChainDecision} = useChainDecisionDropDownViewModel(chainId, exclude);

    return (
        <DavitLabelDropDown
            dropdownItems={createDecisionOptions()}
            label={label}
            onSelect={(item) => onSelect(selectChainDecision(Number(item.value)))}
        />
    );
};

export const ChainDecisionDropDown: FunctionComponent<ChainDecisionDropDownProps> = (props) => {
    const {onSelect, placeholder, value, chainId, exclude} = props;
    const {createDecisionOptions, selectChainDecision} = useChainDecisionDropDownViewModel(chainId, exclude);

    return (
        <DavitDropDown
            dropdownItems={createDecisionOptions()}
            onSelect={(item) => onSelect(selectChainDecision(Number(item.value)))}
            placeholder={placeholder}
            value={value?.toString()}
        />
    );
};

const useChainDecisionDropDownViewModel = (chainId: number, exclude?: number) => {
    const chainDecisions: ChainDecisionTO[] = useSelector(masterDataSelectors.selectChainDecisions);

    const chainDecisionToOption = (decision: ChainDecisionTO): DavitDropDownItemProps => {
        return {
            key: decision.id,
            value: decision.id.toString(),
            text: decision.name,
        };
    };

    const createDecisionOptions = (): DavitDropDownItemProps[] => {
        if (!DavitUtil.isNullOrUndefined(chainDecisions)) {
            let copyDecision: ChainDecisionTO[] = DavitUtil.deepCopy(chainDecisions);
            copyDecision = copyDecision.filter((dec) => dec.chainFk === chainId);
            if (exclude) {
                copyDecision = copyDecision.filter((dec) => dec.id !== exclude);
            }
            return copyDecision.map(chainDecisionToOption);
        }
        return [];
    };

    const selectChainDecision = (id: number): ChainDecisionTO | undefined => {
        if (!DavitUtil.isNullOrUndefined(chainDecisions) && !DavitUtil.isNullOrUndefined(id)) {
            return chainDecisions.find((step) => step.id === id);
        }
        return undefined;
    };

    return {createDecisionOptions, selectChainDecision};
};
