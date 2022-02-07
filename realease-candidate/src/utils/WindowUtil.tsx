import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SequenceCTO } from "../dataAccess/access/cto/SequenceCTO";
import { ChainTO } from "../dataAccess/access/to/ChainTO";
import { editSelectors, Mode } from "../slices/EditSlice";
import { SequenceModelActions, sequenceModelSelectors } from "../slices/SequenceModelSlice";
import { DavitUtil } from "./DavitUtil";

const getWidth = () => window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const getHeight = () => window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

export const useCurrentWitdh = () => {
    // save current window width in the state object
    const [width, setWidth] = useState(getWidth());

    // in this case useEffect will execute only once because
    // it does not have any dependencies.
    useEffect(() => {
        const resizeListener = () => {
            setTimeout(() => setWidth(getWidth()), 150);
        };
        // set resize listener
        window.addEventListener("resize", resizeListener);

        // clean up function
        return () => {
            // remove resize listener
            window.removeEventListener("resize", resizeListener);
        };
    }, []);

    return width;
};

export const useCurrentHeight = () => {
    // save current window width in the state object
    const [height, setHeight] = useState(getHeight());

    // in this case useEffect will execute only once because
    // it does not have any dependencies.
    useEffect(() => {
        const resizeListener = () => {
            setTimeout(() => setHeight(getHeight()), 150);
        };
        // set resize listener
        window.addEventListener("resize", resizeListener);

        // clean up function
        return () => {
            // remove resize listener
            window.removeEventListener("resize", resizeListener);
        };
    }, []);

    return height;
};

export const useCustomZoomEvent = (
    zoomCallBacks?: { zoomInCallBack: () => void; zoomOutCallBack: () => void },
    hover?: boolean,
) => {
    const handleKeyDown = (wheelEvent: WheelEvent) => {
        if (wheelEvent.ctrlKey) {
            wheelEvent.preventDefault();
            if (zoomCallBacks && hover) {
                wheelEvent.deltaY < 0 && zoomCallBacks.zoomInCallBack();
                wheelEvent.deltaY > 0 && zoomCallBacks.zoomOutCallBack();
            }
        }
    };

    const checkZoom = (event: KeyboardEvent) => {
        if (event.ctrlKey) {
            if (event.key === "+" || event.key === "-") {
                event.preventDefault();
            }
        }
    };

    useEffect(() => {
        document.addEventListener("wheel", handleKeyDown, {passive: false});
        document.addEventListener("keydown", checkZoom);

        return () => {
            document.removeEventListener("wheel", handleKeyDown);
            document.removeEventListener("keydown", checkZoom);
        };
    });
};

export const useStepAndLinkNavigation = () => {
    const mode: Mode = useSelector(editSelectors.selectMode);
    const sequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
    const stepIndex: number | null = useSelector(sequenceModelSelectors.selectCurrentStepIndex);
    const selectedChain: ChainTO | null = useSelector(sequenceModelSelectors.selectChain);
    const linkIndex: number | null = useSelector(sequenceModelSelectors.selectCurrentLinkIndex);
    const dispatch = useDispatch();

    const isModeView = (): boolean => {
        return mode === Mode.VIEW;
    };

    const stepBack = () => {
        if (!DavitUtil.isNullOrUndefined(sequence) && isModeView()) {
            dispatch(SequenceModelActions.stepBack(stepIndex));
        }
    };

    const stepNext = () => {
        if (!DavitUtil.isNullOrUndefined(sequence) && isModeView()) {
            dispatch(SequenceModelActions.stepNext(stepIndex));
        }
    };

    const linkNext = () => {
        if (!DavitUtil.isNullOrUndefined(selectedChain) && isModeView()) {
            dispatch(SequenceModelActions.linkNext(linkIndex));
        }
    };

    const linkBack = () => {
        if (!DavitUtil.isNullOrUndefined(selectedChain) && isModeView()) {
            dispatch(SequenceModelActions.linkBack(linkIndex));
        }
    };

    const handleArrowKeyEvent = (event: KeyboardEvent) => {
        if (event.key === "ArrowLeft") {
            stepBack();
        }
        if (event.key === "ArrowRight") {
            stepNext();
        }
        if (event.key === "PageDown") {
            event.preventDefault();
            linkNext();
        }
        if (event.key === "PageUp") {
            event.preventDefault();
            linkBack();
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleArrowKeyEvent);

        return () => {
            document.removeEventListener("keydown", handleArrowKeyEvent);
        };
    });

    return {
        stepNext,
        stepBack,
        linkNext,
        linkBack,
    };
};

/**
 * Execute the given callback if the "Escape" key is press.
 * @param callback
 */
export const useEscHook = (callback: () => void) => {

    useEffect(() => {
        const escButtonCall = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                callback();
            }
        };

        document.addEventListener("keydown", escButtonCall, false);

        return () => {
            document.removeEventListener("keydown", escButtonCall, false);
        };
    }, [callback]);
};

/**
 * Execute the given callback if the "Enter / Return" key is press.
 * @param callback
 */
export const useEnterHook = (callback: () => void) => {

    useEffect(() => {
        const escButtonCall = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                callback();
            }
        };

        document.addEventListener("keydown", escButtonCall, false);

        return () => {
            document.removeEventListener("keydown", escButtonCall, false);
        };
    }, [callback]);
};
