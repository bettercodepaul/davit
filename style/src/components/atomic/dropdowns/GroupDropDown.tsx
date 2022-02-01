import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { GroupTO } from "../../../dataAccess/access/to/GroupTO";
import { masterDataSelectors } from "../../../slices/MasterDataSlice";
import { DavitUtil } from "../../../utils/DavitUtil";
import { DavitDropDown, DavitDropDownItemProps, DavitLabelDropDown } from "./DavitDropDown";

interface GroupDropDownProps {
    onSelect: (group: GroupTO | undefined) => void;
    placeholder?: string;
    value?: number;
}

interface GroupDropDownPropsButton {
    onSelect: (group: GroupTO | undefined) => void;
    label: string;
}

export const GroupDropDown: FunctionComponent<GroupDropDownProps> = (props) => {
    const {onSelect, placeholder, value} = props;
    const {groups, groupToOption, selectGroup} = useGroupDropDownViewModel();

    return (
        <DavitDropDown
            dropdownItems={groups.map(groupToOption)}
            placeholder={placeholder}
            onSelect={(group) => onSelect(selectGroup(Number(group.value), groups))}
            clearable
            value={value?.toString()}
        />
    );
};

export const GroupLabelDropDown: FunctionComponent<GroupDropDownPropsButton> = (props) => {
    const {onSelect, label} = props;
    const {groups, groupToOption, selectGroup} = useGroupDropDownViewModel();

    return (
        <DavitLabelDropDown
            dropdownItems={groups.map(groupToOption)}
            label={label}
            onSelect={(group) => onSelect(selectGroup(Number(group.value), groups))}
        />
    );
};

const useGroupDropDownViewModel = () => {
    const groups: GroupTO[] = useSelector(masterDataSelectors.selectGroups);

    const groupToOption = (group: GroupTO): DavitDropDownItemProps => {
        return {
            key: group.id,
            value: group.id.toString(),
            text: group.name,
        };
    };

    const selectGroup = (groupId: number, groups: GroupTO[]): GroupTO | undefined => {
        if (!DavitUtil.isNullOrUndefined(groups) && !DavitUtil.isNullOrUndefined(groupId)) {
            return groups.find((group) => group.id === groupId);
        }
        return undefined;
    };

    return {groups, groupToOption, selectGroup};
};
