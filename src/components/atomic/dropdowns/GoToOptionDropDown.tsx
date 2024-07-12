import React, { FunctionComponent } from "react";
import { GoToTypes } from "../../../dataAccess/access/types/GoToType";
import { DavitDropDown, DavitDropDownItemProps } from "./DavitDropDown";

interface GoToOptionDropDownProps {
    onSelect: (gotoType: GoToTypes | undefined) => void;
    value?: GoToTypes;
}

export const GoToOptionDropDown: FunctionComponent<GoToOptionDropDownProps> = (props) => {
    const {onSelect, value} = props;

    const getOptions = (): DavitDropDownItemProps[] => {
        return Object.values(GoToTypes).map((goto, index) => goToToOption(goto, index));
    };

    const goToToOption = (goTo: GoToTypes, key: number): DavitDropDownItemProps => {
        return {
            key: key,
            value: goTo,
            text: goTo,
        };
    };

    const selectGotoType = (gotoType: string | undefined): GoToTypes | undefined => {
        return gotoType ? (GoToTypes as any)[gotoType] : undefined;
    };

    return (
        <DavitDropDown
            dropdownItems={getOptions()}
            onSelect={(data) => onSelect(selectGotoType(data.value))}
            value={value ? value : GoToTypes.ERROR}
        />
    );
};
