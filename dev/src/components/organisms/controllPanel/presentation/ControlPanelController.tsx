import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditActions, editSelectors, Mode } from "../../../../slices/EditSlice";
import { DavitUtil } from "../../../../utils/DavitUtil";
import { ControlPanelEditController } from "./fragments/edit/ControlPanelEditController";
import { ControlPanelFileController } from "./fragments/file/ControlPanelFileController";
import { ControlPanelTabController } from "./fragments/tabs/ControlPanelTabController";
import { ControlPanelViewController } from "./fragments/view/ControllPanelViewController";

export interface ControlPanelProps {
}

export const ControlPanelController: FunctionComponent<ControlPanelProps> = () => {
    const {mode} = useControlPanelViewModel();

    const useGetViewByMode = (mode: Mode) => {
        if (!DavitUtil.isNullOrUndefined(mode)) {
            if (mode.includes("EDIT")) {
                return <ControlPanelEditController />;
            }
            if (mode.includes("VIEW")) {
                return <ControlPanelViewController mode={mode} />;
            }
            if (mode.includes("FILE")) {
                return <ControlPanelFileController />;
            }
            if (mode.includes("TAB")) {
                return <ControlPanelTabController hidden={!mode.includes("TAB")} />;
            }
        }
    };

    return (
        <div className="controllerHeader">
            {useGetViewByMode(mode)}
        </div>
    );
};

const useControlPanelViewModel = () => {
    const mode: Mode = useSelector(editSelectors.selectMode);
    const dispatch = useDispatch();

    const onClickNavItem = (mode: string) => {
        switch (mode) {
            case "EDIT":
                dispatch(EditActions.setMode.edit());
                break;
            case "DATA":
                dispatch(EditActions.setMode.editData());
                break;
            case "DATASETUP":
                dispatch(EditActions.setMode.editSequenceConfiguration());
                break;
            case "SEQUENCE":
                dispatch(EditActions.setMode.editSequence());
                break;
            // TODO: check how to activate these since they need an object
            // case "STEP":
            //   dispatch(EditActions.setMode.editStep());
            //   break;
            // case "DECISION":
            //   dispatch(EditActions.setMode.editDecision());
            //   break;
            case "CHAIN":
                dispatch(EditActions.setMode.editChain());
                break;
            // case "DECISION":
            //   dispatch(EditActions.setMode.editChainDecision());
            //   break;
            default:
                break;
        }
    };

    return {mode, onClickNavItem};
};
