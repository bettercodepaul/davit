import React, { FunctionComponent } from "react";
import { ActionType } from "../../../dataAccess/access/types/ActionType";
import { DavitDropDown, DavitDropDownItemProps } from "./DavitDropDown";

interface ActionTypeDropDownnProps {
    onSelect: (actionType: ActionType | undefined) => void;
    placeholder?: string;
    value?: ActionType;
}

export const ActionTypeDropDown: FunctionComponent<ActionTypeDropDownnProps> = (props) => {
    const {onSelect, placeholder, value} = props;
    const actions: ActionType[] = Object.values(ActionType);

    const getActionTypeLabel = (type: ActionType): string => {
        let label: string = "";
        switch (type) {
            case ActionType.ADD:
                label = "Add or Update";
                break;
            case ActionType.DELETE:
                label = "Delete";
                break;
            case ActionType.SEND:
                label = "Send";
                break;
            case ActionType.SEND_AND_DELETE:
                label = "Send and delete";
                break;
            case ActionType.TRIGGER:
                label = "Trigger";
                break;
        }
        return label;
    };

    const actionTypeToOption = (actionType: ActionType, key: number): DavitDropDownItemProps => {
        return {
            key: key,
            value: actionType,
            text: getActionTypeLabel(actionType),
        };
    };

    return (
        <DavitDropDown
            dropdownItems={actions.map((action, index) => actionTypeToOption(action, index))}
            onSelect={(item) => onSelect(item.value as ActionType)}
            placeholder={placeholder}
            value={value}
        />
    );
};
