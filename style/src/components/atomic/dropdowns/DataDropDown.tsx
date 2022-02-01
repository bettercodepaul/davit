import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { masterDataSelectors } from "../../../slices/MasterDataSlice";
import { DavitUtil } from "../../../utils/DavitUtil";
import { DavitDropDown, DavitDropDownItemProps, DavitLabelDropDown } from "./DavitDropDown";

interface DataDropDownProps {
    onSelect: (data: DataCTO | undefined) => void;
    placeholder?: string;
    value?: number;
}

interface DataDropDownLabelProps {
    onSelect: (data: DataCTO | undefined) => void;
    label: string;
}

export const DataDropDown: FunctionComponent<DataDropDownProps> = (props) => {
    const {onSelect, placeholder, value} = props;
    const {datas, selectData, dataToOption} = useDataDropDownViewModel();

    return (
        <DavitDropDown
            dropdownItems={datas.map(dataToOption)}
            placeholder={placeholder}
            value={value?.toString()}
            onSelect={(data) => onSelect(selectData(Number(data.value), datas))}
        />
    );
};

export const DataLabelDropDown: FunctionComponent<DataDropDownLabelProps> = (props) => {
    const {onSelect, label} = props;
    const {datas, selectData, dataToOption} = useDataDropDownViewModel();

    return (
        <DavitLabelDropDown
            dropdownItems={datas.map(dataToOption)}
            onSelect={(data) => onSelect(selectData(Number(data.value), datas))}
            label={label}
        />
    );
};

const useDataDropDownViewModel = () => {
    const datas: DataCTO[] = useSelector(masterDataSelectors.selectDatas);

    const selectData = (dataId: number, datas: DataCTO[]): DataCTO | undefined => {
        if (!DavitUtil.isNullOrUndefined(dataId) && !DavitUtil.isNullOrUndefined(datas)) {
            return datas.find((data) => data.data.id === dataId);
        }
        return undefined;
    };

    const dataToOption = (data: DataCTO): DavitDropDownItemProps => {
        return {
            key: data.data.id,
            value: data.data.id.toString(),
            text: data.data.name,
        };
    };

    return {datas, selectData, dataToOption};
};
