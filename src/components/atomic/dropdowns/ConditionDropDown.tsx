import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { ActorCTO } from "../../../dataAccess/access/cto/ActorCTO";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { ConditionTO } from "../../../dataAccess/access/to/ConditionTO";
import { masterDataSelectors } from "../../../slices/MasterDataSlice";
import { DavitDropDownItemProps, DavitLabelDropDown } from "./DavitDropDown";

interface ConditionLabelDropDownProps {
    onSelect: (conditionId: number | undefined) => void;
    conditions: ConditionTO[];
    label: string;
}

export const ConditionLabelDropDown: FunctionComponent<ConditionLabelDropDownProps> = (props) => {
    const {onSelect, label, conditions} = props;

    const actors: ActorCTO[] = useSelector(masterDataSelectors.selectActors);
    const datas: DataCTO[] = useSelector(masterDataSelectors.selectDatas);

    const conditionToOption = (condition: ConditionTO): DavitDropDownItemProps => {
        const actorName: string =
            actors.find((actor) => actor.actor.id === condition.actorFk)?.actor.name || "Could not find Actor";
        let dataName: string = "Could not find Data";
        let instanceName: string = "Could not find Instance";
        const data: DataCTO | undefined = datas.find((data) => data.data.id === condition.dataFk);

        if (data) {
            dataName = data.data.name;
            instanceName =
                data.data.instances.find((instance) => instance.id === condition.instanceFk)?.name ||
                "Could not find Instance";
        }

        return {
            key: condition.id,
            value: condition.id.toString(),
            text: `${actorName} - ${dataName}: ${instanceName}`,
        };
    };

    return (
        <DavitLabelDropDown
            dropdownItems={conditions.map((condition) => {
                return conditionToOption(condition);
            })}
            onSelect={(condition) => onSelect(Number(condition.value))}
            label={label}
        />
    );
};
