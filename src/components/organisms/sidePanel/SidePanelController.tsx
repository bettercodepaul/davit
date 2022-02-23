import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../../images/bcxp_logo.png";
import { DAVIT_VERISON } from "../../../DavitConstants";
import { EditActions, editSelectors, Mode } from "../../../slices/EditSlice";
import { DavitSidePanelButton } from "../../atomic/buttons/DavitSidePanelButton";
import { DavitIcons } from "../../atomic/icons/IconSet";
import "./SidePanelController.css";

export interface SidePanelProps {
}

export const SidePanelController: FunctionComponent<SidePanelProps> = () => {
    const {setModeToEdit, setModeToFile, setModeToView, mode} = useSidePanelViewModel();

    return (
        <div className="leftPanel">
            <DavitSidePanelButton icon={DavitIcons.pencil}
                                  onClick={setModeToEdit}
                                  active={mode.includes(Mode.EDIT.toString())}
            />
            <DavitSidePanelButton icon={DavitIcons.eye}
                                  onClick={setModeToView}
                                  active={mode === Mode.VIEW}
            />
            <DavitSidePanelButton icon={DavitIcons.file}
                                  onClick={setModeToFile}
                                  active={mode === Mode.FILE}
            />
            {/*TODO: enable wenn tabs are fixed!*/}
            {/*<DavitSidePanelButton icon="external alternate" onClick={setModeToTab} active={mode === Mode.TAB} />*/}

            <div className="logo-area flex flex-center flex-column">

                <img className="company-logo"
                     src={logo}
                     alt="fireSpot"
                />

                <div className="verticalLabel padding-top-m padding-bottom-m">DAVIT by</div>

                <label className="label-version">
                    v {DAVIT_VERISON}
                </label>

            </div>
        </div>
    );
};

const useSidePanelViewModel = () => {
    const dispatch = useDispatch();
    const mode = useSelector(editSelectors.selectMode);

    const setModeToEdit = () => {
        dispatch(EditActions.setMode.edit());
    };

    const setModeToView = () => {
        dispatch(EditActions.setMode.view());
    };

    const setModeToFile = () => {
        dispatch(EditActions.setMode.file());
    };

    const setModeToTab = () => {
        dispatch(EditActions.setMode.tab());
    };

    return {
        setModeToEdit,
        setModeToView,
        setModeToFile,
        setModeToTab,
        mode,
    };
};
