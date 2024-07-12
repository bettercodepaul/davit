import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { ActorCTO } from "../../../dataAccess/access/cto/ActorCTO";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { InitDataTO } from "../../../dataAccess/access/to/InitDataTO";
import { masterDataSelectors } from "../../../slices/MasterDataSlice";
import { DavitUtil } from "../../../utils/DavitUtil";
import { DavitDropDown, DavitDropDownItemProps, DavitLabelDropDown } from "./DavitDropDown";

interface InitDataDropDownDownProps {
    initDatas: InitDataTO[];
    onSelect: (initData: InitDataTO | undefined) => void;
    placeholder?: string;
    value?: number;
}

interface InitDataLabelDropDownProps {
    initDatas: InitDataTO[];
    onSelect: (initData: InitDataTO | undefined) => void;
    label: string;
}

export const InitDataDropDown: FunctionComponent<InitDataDropDownDownProps> = (props) => {
    const {onSelect, placeholder, value, initDatas} = props;
    const {initDataToOption, selectInitData} = useDataSetupDropDownViewModel();

    return (
        <DavitDropDown
            dropdownItems={initDatas.map(initDataToOption)}
            placeholder={placeholder}
            onSelect={(initData) => onSelect(selectInitData(Number(initData.value), initDatas))}
            clearable
            value={value?.toString()}
        />
    );
};

export const InitDataLabelDropDown: FunctionComponent<InitDataLabelDropDownProps> = (props) => {
    const {onSelect, label, initDatas} = props;
    const {initDataToOption, selectInitData} = useDataSetupDropDownViewModel();

    return (
        <DavitLabelDropDown
            dropdownItems={initDatas.map(initDataToOption)}
            label={label}
            onSelect={(initData) => onSelect(selectInitData(Number(initData.value), initDatas))}
        />
    );
};

const useDataSetupDropDownViewModel = () => {
    const actors: ActorCTO[] = useSelector(masterDataSelectors.selectActors);
    const datas: DataCTO[] = useSelector(masterDataSelectors.selectDatas);

    const getActorName = (actorId: number): string => {
        return actors.find((actor) => actor.actor.id === actorId)?.actor.name || "";
    };

    const getDataName = (dataId: number, instanceId?: number): string => {
        let dataName: string;
        let instanceName: string = "";
        const data: DataCTO | undefined = datas.find((data) => data.data.id === dataId);
        dataName = data?.data.name || "";
        if (data && instanceId && instanceId > 1) {
            instanceName = data.data.instances.find((inst) => inst.id === instanceId)?.name || "";
            dataName = dataName + " - " + instanceName;
        }
        return dataName;
    };

    const initDataToOption = (initData: InitDataTO): DavitDropDownItemProps => {
        return {
            key: initData.id,
            value: initData.id.toString(),
            text: getActorName(initData.actorFk) + " + " + getDataName(initData.dataFk, initData.instanceFk),
        };
    };

    const selectInitData = (initDataId: number, initDatas: InitDataTO[]): InitDataTO | undefined => {
        if (!DavitUtil.isNullOrUndefined(initDataId) && !DavitUtil.isNullOrUndefined(initDatas)) {
            return initDatas.find((initData) => initData.id === initDataId);
        }
        return undefined;
    };

    return {initDataToOption, selectInitData};
};
