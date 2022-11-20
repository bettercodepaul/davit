import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { ActorCTO } from "../../../dataAccess/access/cto/ActorCTO";
import { masterDataSelectors } from "../../../slices/MasterDataSlice";
import { DavitUtil } from "../../../utils/DavitUtil";
import { DavitDropDown, DavitDropDownItemProps, DavitLabelDropDown } from "./DavitDropDown";

interface ActorDropDownProps {
    onSelect: (actor: ActorCTO | undefined) => void;
    placeholder?: string;
    value?: number;
    dataTestId?: string;
}

interface ActorDropDownLabelProps {
    onSelect: (actor: ActorCTO | undefined) => void;
    label: string;
    dataTestId?: string;
}

export const ActorDropDown: FunctionComponent<ActorDropDownProps> = (props) => {
    const {onSelect, placeholder, value, dataTestId} = props;
    const {actors, actorToOption, selectActor} = useActorDropDownViewModel();

    return (
        <DavitDropDown
            dropdownItems={actors.map((actor) => actorToOption(actor))}
            onSelect={(item) => onSelect(selectActor(Number(item.value), actors))}
            placeholder={placeholder}
            value={value?.toString()}
            dataTestId={dataTestId}
        />
    );
};

export const ActorDropDownLabel: FunctionComponent<ActorDropDownLabelProps> = (props) => {
    const {onSelect, label, dataTestId} = props;
    const {actorToOption, actors, selectActor} = useActorDropDownViewModel();

    return (
        <DavitLabelDropDown
            dropdownItems={actors.map((actor) => actorToOption(actor))}
            onSelect={(item) => onSelect(selectActor(Number(item.value), actors))}
            label={label}
            dataTestId={dataTestId}
        />
    );
};

const useActorDropDownViewModel = () => {
    const actors: ActorCTO[] = useSelector(masterDataSelectors.selectActors);

    const actorToOption = (actor: ActorCTO): DavitDropDownItemProps => {
        return {
            key: actor.actor.id,
            value: actor.actor.id.toString(),
            text: actor.actor.name,
        };
    };

    const selectActor = (actorId: number, actors: ActorCTO[]): ActorCTO | undefined => {
        if (!DavitUtil.isNullOrUndefined(actors) && !DavitUtil.isNullOrUndefined(actorId)) {
            return actors.find((actor) => actor.actor.id === actorId);
        }
        return undefined;
    };

    return {actors, actorToOption, selectActor};
};
