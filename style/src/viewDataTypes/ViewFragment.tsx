import React from "react";
import { ActorDataState } from "./ActorDataState";

export interface ViewFragmentProps {
    parentId: number | { dataId: number; instanceId?: number };
    state: ActorDataState;
    name: string;
}

const getClassnameForViewFragmentState = (state: ActorDataState) => {
    return "carv2ActorData" + state;
};

export const createViewFragment = (actorDataFragmentProps: ViewFragmentProps, key: number) => {
    const getCheckFeeld = (state: ActorDataState): JSX.Element | null => {
        if (state === ActorDataState.CHECKED) {
            return (
                <div
                    className={"gg-check-o"}
                    style={{color: "green", backgroundColor: "var(--carv2-data-persistent-color)"}}
                />
            );
        }

        if (state === ActorDataState.CHECK_FAILED) {
            return (
                <div
                    className={"gg-close-o"}
                    style={{color: "red", backgroundColor: "var(--carv2-data-persistent-color)"}}
                />
            );
        }

        return null;
    };

    return (
        <div className="viewFragment"
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
