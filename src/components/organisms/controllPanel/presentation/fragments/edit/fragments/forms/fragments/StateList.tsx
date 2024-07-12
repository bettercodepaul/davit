import React, { FunctionComponent } from "react";
import { StateTO } from "../../../../../../../../../dataAccess/access/to/StateTO";
import { DavitAddButton, DavitDeleteButton, DavitTextInput } from "../../../../../../../../atomic";
import { ToggleButton } from "../../../../../../../../molecules/ToggleButton";
import "./StateList.css";

interface StateListProps {
    statesToEdit: StateTO[];
    stateColumnName: string;
    setActiveCallback: (state: StateTO, active: boolean) => void;
    changeName?: (name: string, stateId: number) => void;
    removeStateCallback?: (stateId: number) => void;
    addStateCallback?: () => void;
}

export const StateList: FunctionComponent<StateListProps> = (props) => {
    const {statesToEdit, addStateCallback, changeName, removeStateCallback, setActiveCallback} = props;

    const trueLabel: string = "TRUE";
    const falseLabel: string = "FALSE";

    const buildTableRow = (state: StateTO, index: number): JSX.Element[] => {

        const getLabel = (): JSX.Element => {
            return (
                <span className="gridItem"
                      key={index + "a"}
                >
            {changeName
                ? <DavitTextInput
                    onChangeCallback={(name) => changeName ? changeName(name, state.id) : {}}
                    placeholder="State Name"
                    value={state.label}
                    focus
                />
                : <label>{state.label}</label>}
                </span>);
        };

        const getToggleButton = (): JSX.Element => {
            return (
                <span className="gridItem"
                      key={index + "b"}
                >
                <ToggleButton
                    toggleCallback={(is) => setActiveCallback(state, is)}
                    isLeft={state.isState}
                    leftLabel={trueLabel}
                    rightLabel={falseLabel}
                />
                </span>
            );
        };

        const getDeleteButton = (): JSX.Element => {
            return (
                <span className="gridItem"
                      key={index + "c"}
                >

            {removeStateCallback
                ?
                <DavitDeleteButton onClick={() => removeStateCallback(state.id)}
                                   noConfirm
                />
                : undefined}
                </span>
            );
        };

        return [getLabel(), getToggleButton(), getDeleteButton()];
    };

    return (
        <div id="stateList"
             className="gridContainer"
        >

            <div className="header gridItem"><label>Name</label></div>
            <div className="header gridItem"><label>State</label></div>
            <div className="header gridItem">{addStateCallback && <DavitAddButton onClick={addStateCallback} />}</div>
            {statesToEdit.map(buildTableRow)}
        </div>
    );
};
