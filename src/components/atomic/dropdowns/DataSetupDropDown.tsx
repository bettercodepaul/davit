import React, { FunctionComponent } from "react";
import { DataSetupTO } from "../../../dataAccess/access/to/DataSetupTO";
import { DavitUtil } from "../../../utils/DavitUtil";
import { DavitDropDown, DavitDropDownItemProps, DavitLabelDropDown } from "./DavitDropDown";

interface DataSetupDropDownProps {
    onSelect: (dataSetup: DataSetupTO | undefined) => void;
    placeholder?: string;
    value?: number;
}

interface DataSetupLabelDropDownProps {
    onSelect: (dataSetup: DataSetupTO | undefined) => void;
    label: string;
}

export const DataSetupDropDown: FunctionComponent<DataSetupDropDownProps> = (props) => {
    const {onSelect, placeholder, value} = props;
    const {dataSetups, selectDataSetup, dataSetupToOption} = useDataSetupDropDownViewModel();

    return (
        <DavitDropDown
            dropdownItems={dataSetups.map(dataSetupToOption)}
            value={value?.toString()}
            clearable={true}
            onSelect={(setup) => onSelect(selectDataSetup(Number(setup.value), dataSetups))}
            placeholder={placeholder}
        />
    );
};

export const DataSetupLabelDropDown: FunctionComponent<DataSetupLabelDropDownProps> = (props) => {
    const {onSelect, label} = props;
    const {dataSetups, selectDataSetup, dataSetupToOption} = useDataSetupDropDownViewModel();

    return (
        <DavitLabelDropDown
            dropdownItems={dataSetups.map(dataSetupToOption)}
            label={label}
            onSelect={(setup) => onSelect(selectDataSetup(Number(setup.value), dataSetups))}
        />
    );
};

const useDataSetupDropDownViewModel = () => {
    // const dataSetups: DataSetupTO[] = useSelector(masterDataSelectors.selectDataSetups);
    const dataSetups: DataSetupTO[] = [];

    const dataSetupToOption = (dataSetup: DataSetupTO): DavitDropDownItemProps => {
        return {
            key: dataSetup.id,
            value: dataSetup.id.toString(),
            text: dataSetup.name,
        };
    };

    const selectDataSetup = (dataSetupId: number, dataSetups: DataSetupTO[]): DataSetupTO | undefined => {
        if (!DavitUtil.isNullOrUndefined(dataSetups) && !DavitUtil.isNullOrUndefined(dataSetupId)) {
            return dataSetups.find((dataSetup) => dataSetup.id === dataSetupId);
        }
        return undefined;
    };

    return {dataSetups, dataSetupToOption, selectDataSetup};
};
