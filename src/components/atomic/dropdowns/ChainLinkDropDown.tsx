import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { ChainLinkTO } from "../../../dataAccess/access/to/ChainLinkTO";
import { masterDataSelectors } from "../../../slices/MasterDataSlice";
import { DavitUtil } from "../../../utils/DavitUtil";
import { DavitDropDown, DavitDropDownItemProps, DavitLabelDropDown } from "./DavitDropDown";

interface ChainLinkDropDownLabelProps {
    onSelect: (link: ChainLinkTO | undefined) => void;
    chainId: number;
    label: string;
    exclude?: number;
}

interface ChainLinkDropDownProps {
    onSelect: (link: ChainLinkTO | undefined) => void;
    chainId: number;
    placeholder?: string;
    value?: number;
    exclude?: number;
}

export const ChainLinkDropDown: FunctionComponent<ChainLinkDropDownProps> = (props) => {
    const {onSelect, placeholder, value, chainId, exclude} = props;
    const {linkOptions, selectChainLink} = useChainStepDropDownViewModel(chainId, exclude);

    const validatedValue = (): string | undefined => {
        return value ? (value === -1 ? undefined : value.toString()) : undefined;
    };

    return (
        <DavitDropDown
            dropdownItems={linkOptions()}
            value={validatedValue()}
            placeholder={placeholder}
            onSelect={(chainLink) => onSelect(selectChainLink(Number(chainLink.value)))}
        />
    );
};

export const ChainLinkDropDownButton: FunctionComponent<ChainLinkDropDownLabelProps> = (props) => {
    const {onSelect, label, chainId, exclude} = props;
    const {selectChainLink, linkOptions} = useChainStepDropDownViewModel(chainId, exclude);

    return (
        <DavitLabelDropDown
            dropdownItems={linkOptions()}
            onSelect={(link) => onSelect(selectChainLink(Number(link.value)))}
            label={label}
        />
    );
};

const useChainStepDropDownViewModel = (chainId: number, exclude?: number) => {
    const chainlinks: ChainLinkTO[] = useSelector(masterDataSelectors.selectChainLinks);

    const chainStepToOption = (link: ChainLinkTO): DavitDropDownItemProps => {
        return {
            key: link.id,
            value: link.id.toString(),
            text: link.name,
        };
    };

    const linkOptions = (): DavitDropDownItemProps[] => {
        if (!DavitUtil.isNullOrUndefined(chainlinks)) {
            let copyLinks: ChainLinkTO[] = DavitUtil.deepCopy(chainlinks);
            copyLinks = copyLinks.filter((link) => link.chainFk === chainId);
            if (exclude) {
                copyLinks = copyLinks.filter((link) => link.id !== exclude);
            }
            return copyLinks.map(chainStepToOption);
        }
        return [];
    };

    const selectChainLink = (id: number): ChainLinkTO | undefined => {
        if (!DavitUtil.isNullOrUndefined(chainlinks) && !DavitUtil.isNullOrUndefined(id)) {
            return chainlinks.find((step) => step.id === id);
        }
        return undefined;
    };

    return {linkOptions, selectChainLink};
};
