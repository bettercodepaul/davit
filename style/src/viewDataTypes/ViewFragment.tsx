import React from "react";
import { ActorDataState } from "./ActorDataState";
import "./ViewFragment.css";

export interface ViewFragmentProps {
    parentId: number | { dataId: number; instanceId?: number };
    state: ActorDataState;
    name: string;
}

const getClassnameForViewFragmentState = (state: ActorDataState) => {
    return `actorData ${state} flex flex-center`;
};

export const createViewFragment = (actorDataFragmentProps: ViewFragmentProps, key: number) => {
    const getCheckFeeld = (state: ActorDataState): JSX.Element | null => {
        if (state === ActorDataState.CHECKED) {
            return (
                <div
                    className={"gg-check-o"}
                    //TODO: css variablen nicht hier setzten
                    style={{color: "green", backgroundColor: "var(--data-persistent-color)"}}
                />
            );
        }

        if (state === ActorDataState.CHECK_FAILED) {
            return (
                <div
                    className={"gg-close-o"}
                    //TODO: css variablen nicht hier setzten
                    style={{color: "red", backgroundColor: "var(--data-persistent-color)"}}
                />
            );
        }

        return null;
    };

    return (
        <div className="viewFragment flex flex-center width-fluid"
             key={key}
        >
            <div className={getClassnameForViewFragmentState(actorDataFragmentProps.state)}
                 key={key}
            >
                {actorDataFragmentProps.name}
            </div>
            {getCheckFeeld(actorDataFragmentProps.state) && getCheckFeeld(actorDataFragmentProps.state)}
        </div>
    );
};
