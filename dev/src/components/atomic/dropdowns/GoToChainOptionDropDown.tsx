import React, { FunctionComponent } from "react";
import { GoToTypes } from "../../../dataAccess/access/types/GoToType";
import { GoToTypesChain } from "../../../dataAccess/access/types/GoToTypeChain";
import { DavitDropDown, DavitDropDownItemProps } from "./DavitDropDown";

interface GoToChainOptionDropDownProps {
    onSelect: (gotoType: GoToTypesChain | undefined) => void;
    value?: GoToTypesChain;
}

export const GoToChainOptionDropDown: FunctionComponent<GoToChainOptionDropDownProps> = (props) => {
    const {onSelect, value} = props;

    const getOptions = (): DavitDropDownItemProps[] => {
        return Object.values(GoToTypesChain).map((goto, index) => goToToOption(goto, index));
    };

    const goToToOption = (goTo: GoToTypesChain, key: number): DavitDropDownItemProps => {
        return {
            key: key,
            value: goTo,
            text: goTo,
        };
    };

    const selectGotoType = (gotoType: string | undefined): GoToTypesChain | undefined => {
        return gotoType ? (GoToTypesChain as any)[gotoType] : undefined;
    };

    return (
        <DavitDropDown
            dropdownItems={getOptions()}
            onSelect={(goto) => onSelect(selectGotoType(goto.value))}
            value={value ? value : GoToTypes.ERROR}
        />
    );
};
