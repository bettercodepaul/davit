import React, { FunctionComponent } from "react";
import { DataInstanceTO } from "../../../dataAccess/access/to/DataInstanceTO";
import { DavitDropDown, DavitDropDownItemProps, DavitLabelDropDown } from "./DavitDropDown";

interface DataInstanceDropDownProps {
    onSelect: (id: number | undefined) => void;
    instances: DataInstanceTO[];
    placeholder?: string;
    value?: number;
}

interface DataInstanceLabelDropDownProps {
    onSelect: (id: number | undefined) => void;
    instances: DataInstanceTO[];
    label: string;
}

/**
 * List's all instances of a data object.
 */
export const DataInstanceDropDown: FunctionComponent<DataInstanceDropDownProps> = (props) => {
    const {onSelect, placeholder, value, instances} = props;
    const {dataInstacesToOption} = useDataInstanceDropDownViewModel();

    return (
        <DavitDropDown
            dropdownItems={dataInstacesToOption(instances)}
            onSelect={(instance) => onSelect(Number(instance.value))}
            placeholder={placeholder}
            value={value?.toString()}
        />
    );
};

export const DataInstanceLabelDropDown: FunctionComponent<DataInstanceLabelDropDownProps> = (props) => {
    const {onSelect, instances, label} = props;
    const {dataInstacesToOption} = useDataInstanceDropDownViewModel();

    return (
        <DavitLabelDropDown
            dropdownItems={dataInstacesToOption(instances)}
            onSelect={(instance) => onSelect(Number(instance.value))}
            label={label}
        />
    );
};

const useDataInstanceDropDownViewModel = () => {
    const dataInstacesToOption = (instances: DataInstanceTO[]): DavitDropDownItemProps[] => {
        const dropdownItemProps: DavitDropDownItemProps[] = [];
        instances.forEach((instanc) =>
            dropdownItemProps.push({
                key: instanc.id,
                value: instanc.id.toString(),
                text: instanc.name,
            }),
        );
        return dropdownItemProps;
    };

    return {dataInstacesToOption};
};
