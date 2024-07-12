import React, { FunctionComponent, useState } from "react";
import { useSelector } from "react-redux";
import { ChainStateTO } from "../../dataAccess/access/to/ChainStateTO";
import { SequenceStateTO } from "../../dataAccess/access/to/SequenceStateTO";
import { StateTO } from "../../dataAccess/access/to/StateTO";
import { sequenceModelSelectors } from "../../slices/SequenceModelSlice";
import { DavitShowMoreButton } from "../atomic";
import "./StateView.css";

interface StateViewProps {
    showChain: boolean;
}

export const StateView: FunctionComponent<StateViewProps> = (props) => {
    const {showChain} = props;

    const sequenceStates: SequenceStateTO[] = useSelector(sequenceModelSelectors.selectSequence)?.sequenceStates || [];
    const chainStates: ChainStateTO[] = useSelector(sequenceModelSelectors.selectChainCTO)?.chainStates || [];

    const falseStates: SequenceStateTO[] = useSelector(sequenceModelSelectors.selectFalseStates);
    const trueStates: SequenceStateTO[] = useSelector(sequenceModelSelectors.selectTrueStates);

    const HEADER: string = "State";
    const [showStates, setShowStates] = useState<boolean>(false);

    const buildStateRow = (state: StateTO, index: number): JSX.Element => {

            const stateIsTrue: boolean = trueStates.some(trueState => trueState.id === state.id);
            const stateIsFalse: boolean = falseStates.some(falseState => falseState.id === state.id);

            return (
                <div key={index}
                     className={"stateViewState flex content-space-between " + (index !== 0 ? "stateViewBorder" : "")}
                >
                    <div className="flex flex-start align-center padding-small">
                        <label>{state.label}</label>
                    </div>

                    <div className="flex flex-end align-center padding-small">
                        <svg className="stateViewSvgField">
                            <line className={state.isState ? "stateViewIsTrue" : "stateViewIsFalse"}
                                  x1="0"
                                  y1="0"
                                  x2="1rem"
                                  y2="0"
                            />
                        </svg>
                        {stateIsTrue && <div className="gg-check-o" />}
                        {stateIsFalse && <div className="gg-close-o" />}
                        {!stateIsFalse && !stateIsTrue && <div className="stateViewSpacer" />}
                    </div>
                </div>
            );
        }
    ;

    return (
        <div className="stateView flex flex-column border border-small">
            <div className="stateViewHeader flex content-space-between padding-small">

                <div className="flex flex-start align-center">
                    <label>{HEADER}</label>
                </div>

                <div className="flex flex-end align-center">
                    <svg className="stateViewSvgField">
                        <line className={falseStates.length > 0 ? "stateViewIsFalse" : "stateViewIsTrue"}
                              x1="0"
                              y1="0"
                              x2="1rem"
                              y2="0"
                        />
                    </svg>
                    {falseStates.length <= 0 && trueStates.length > 0 && <div className="gg-check-o" />}
                    {falseStates.length > 0 && <div className="gg-close-o" />}
                    {falseStates.length <= 0 && trueStates.length <= 0 && <div className="stateViewSpacer" />}
                </div>
                <DavitShowMoreButton show={showStates}
                                     onClick={setShowStates}
                />
            </div>
            {showStates && <div className="flex flex-column">
                {!showChain && sequenceStates.map((state, index) => buildStateRow(state, index))}
                {showChain && chainStates.map((state, index) => buildStateRow(state, index))}
            </div>}

        </div>
    );
};

