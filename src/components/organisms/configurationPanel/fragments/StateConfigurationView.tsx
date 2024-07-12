import React, { FunctionComponent } from "react";
import { StateTO } from "../../../../dataAccess/access/to/StateTO";
import { StateList } from "../../controllPanel/presentation/fragments/edit/fragments/forms/fragments/StateList";

interface StateConfigurationViewProps {
    states: StateTO[];
    setStateCallback: (state: StateTO, active: boolean) => void;
}

export const StateConfigurationView: FunctionComponent<StateConfigurationViewProps> = (props) => {

    const {states, setStateCallback} = props;

    const HEADER: string = "State";

    return (
        <StateList
            statesToEdit={states}
            stateColumnName={HEADER}
            setActiveCallback={setStateCallback}
        />
    );
};

