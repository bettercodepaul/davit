import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { DataInstanceTO } from "../../../dataAccess/access/to/DataInstanceTO";
import { masterDataSelectors } from "../../../slices/MasterDataSlice";
import { DavitDropDown, DavitDropDownItemProps } from "./DavitDropDown";

export interface DataAndInstanceId {
    dataFk: number;
    instanceId: number;
}

interface InstanceDropDownProps {
    onSelect: (dataAndInstance: DataAndInstanceId | undefined) => void;
    placeholder?: string;
    value?: string;
}

export const InstanceDropDown: FunctionComponent<InstanceDropDownProps> = (props) => {
    const {onSelect, placeholder, value} = props;
    const {selectInstance, createOptions} = useInstanceDropDownViewModel();

    return (
        <DavitDropDown
            dropdownItems={createOptions()}
            placeholder={placeholder}
            onSelect={(instance) => onSelect(selectInstance(instance.value))}
            value={value !== "" ? value : undefined}
        />
    );
};


const useInstanceDropDownViewModel = () => {
    const datas: DataCTO[] = useSelector(masterDataSelectors.selectDatas);

    const selectInstance = (optionItemString: string): DataAndInstanceId | undefined => {
        if (optionItemString !== null && datas !== null) {
            return JSON.parse(optionItemString);
        }
        return undefined;
    };

    const selectInstances = (optionItemStrings: string[] | undefined): DataAndInstanceId[] => {
        const dataAndInstanceIds: DataAndInstanceId[] = [];
        if (optionItemStrings) {
            optionItemStrings.forEach((op) => {
                const dataInst: DataAndInstanceId | undefined = selectInstance(op);
                if (dataInst) {
                    dataAndInstanceIds.push(dataInst);
                }
            });
        }
        return dataAndInstanceIds;
    };

    const createOptions = (): DavitDropDownItemProps[] => {
        const dropdownItemas: DavitDropDownItemProps[] = [];
        if (datas) {
            datas.forEach((data) => {
                data.data.instances.forEach((inst) => {
                    dropdownItemas.push(instanceToOption(inst, data, data.data.id * 100 + inst.id));
                });
            });
        }
        return dropdownItemas;
    };

    const instanceToOption = (instance: DataInstanceTO, data: DataCTO, key: number): DavitDropDownItemProps => {
        const optionItem: DataAndInstanceId = {dataFk: data.data.id, instanceId: instance.id};
        const optionItemString: string = JSON.stringify(optionItem);
        let optionLabel: string = data.data.name;
        if (instance.id !== -1) {
            optionLabel = optionLabel + " - " + instance.name;
        }
        return {
            key: key,
            value: optionItemString,
            text: optionLabel,
        };
    };

    return {selectInstance, selectInstances, createOptions};
};
