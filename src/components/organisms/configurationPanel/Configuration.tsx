import React, { FunctionComponent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChainCTO } from "../../../dataAccess/access/cto/ChainCTO";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { ChainConfigurationTO } from "../../../dataAccess/access/to/ChainConfigurationTO";
import { ChainStateTO } from "../../../dataAccess/access/to/ChainStateTO";
import { ChainTO } from "../../../dataAccess/access/to/ChainTO";
import { InitDataTO } from "../../../dataAccess/access/to/InitDataTO";
import { SequenceConfigurationTO } from "../../../dataAccess/access/to/SequenceConfigurationTO";
import { SequenceStateTO } from "../../../dataAccess/access/to/SequenceStateTO";
import { StateTO } from "../../../dataAccess/access/to/StateTO";
import { editActions, EditActions, editSelectors } from "../../../slices/EditSlice";
import { SequenceModelActions, sequenceModelSelectors, ViewLevel } from "../../../slices/SequenceModelSlice";
import { EditChainConfiguration } from "../../../slices/thunks/ChainConfigurationThunks";
import { EditSequenceConfiguration } from "../../../slices/thunks/SequenceConfigurationThunks";
import { ElementSize } from "../../../style/Theme";
import { DavitUtil } from "../../../utils/DavitUtil";
import {
    ActorDropDown,
    ChainDropDown,
    DavitAddButton,
    DavitDeleteButton,
    DavitIconButton,
    DavitShowMoreButton,
    InstanceDropDown,
    SequenceDropDown,
} from "../../atomic";
import { DavitToggleButton } from "../../atomic/buttons/DavitToggleButton";
import { ChainConfigurationDropDown } from "../../atomic/dropdowns/ChainConfigurationDropDown";
import { SequenceConfigurationDropDown } from "../../atomic/dropdowns/SequenceConfigurationDropDown";
import { DavitIcons } from "../../atomic/icons/IconSet";
import { NoteIcon } from "../../atomic/icons/NoteIcon";
import "./Configuration.css";
import { ConfigurationSelectButton } from "./fragments/ConfigurationSelectButton";
import { SaveConfigurationModal } from "./fragments/SaveConfigurationModal";
import { StateConfigurationView } from "./fragments/StateConfigurationView";

export interface ConfigurationPanelProps {

}

export const ConfigurationPanel: FunctionComponent<ConfigurationPanelProps> = () => {

    const dispatch = useDispatch();

    const [sequenceOptions, setSequenceOptions] = useState<boolean>(false);
    const [showMore, setShowMore] = useState<boolean>(true);
    const [showSaveConfiguration, setShowSaveConfiguration] = useState<boolean>(false);

    const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
    const sequenceConfigurationToEdit: SequenceConfigurationTO | null = useSelector(editSelectors.selectSequenceConfigurationToEdit);

    const selectedChain: ChainCTO | null = useSelector(sequenceModelSelectors.selectChainCTO);
    const chainConfigurationToEdit: ChainConfigurationTO | null = useSelector(editSelectors.selectChainConfiguration);

    const runCalc = () => {
        if (selectedSequence !== null && sequenceConfigurationToEdit !== null) {
            dispatch(SequenceModelActions.setCurrentSequenceById(selectedSequence.sequenceTO.id));
            dispatch(SequenceModelActions.setCurrentSequenceConfiguration(sequenceConfigurationToEdit));
            dispatch(EditActions.setMode.view());
        }

        if (selectedChain !== null && chainConfigurationToEdit !== null) {
            const copyChainTO: ChainTO = DavitUtil.deepCopy(selectedChain.chain);
            dispatch(SequenceModelActions.setCurrentChainConfiguration(chainConfigurationToEdit));
            // We have to set first the mode so the slice will call the calculation!
            dispatch(EditActions.setMode.view());
            dispatch(SequenceModelActions.setCurrentChain(copyChainTO));
        }
    };

    // ------------------------------- sequence ------------------------------

    const newSequenceConfiguration = (sequenceId: number) => {
        dispatch(EditSequenceConfiguration.create(sequenceId));
    };

    const setSequenceConfiguration = (sequenceConfiguration: SequenceConfigurationTO | undefined) => {
        if (sequenceConfiguration === undefined) {
            if (sequenceConfigurationToEdit !== null && sequenceConfigurationToEdit.name === "") {
                deleteSequenceConfiguration();
            } else {
                newSequenceConfiguration(selectedSequence!.sequenceTO.id);
            }
        } else {
            dispatch(EditSequenceConfiguration.update(sequenceConfiguration));
        }
    };

    const saveSequenceConfiguration = (name?: string) => {
        if (!DavitUtil.isNullOrUndefined(sequenceConfigurationToEdit) && !DavitUtil.isNullOrUndefined(selectedSequence)) {
            if (sequenceConfigurationToEdit!.name !== "" || (name !== "" && name !== undefined)) {
                const copySequenceConfiguration: SequenceConfigurationTO = DavitUtil.deepCopy(sequenceConfigurationToEdit);
                // set sequence id
                copySequenceConfiguration.sequenceFk = selectedSequence!.sequenceTO.id;
                // set new name if given
                if (name !== "" && name !== undefined) {
                    copySequenceConfiguration.name = name;
                }
                // remove empty init data's
                copySequenceConfiguration.initDatas = copySequenceConfiguration.initDatas.filter(initD => initD.actorFk !== -1 && initD.dataFk !== -1 && initD.instanceFk !== -1);
                // save sequence configuration
                dispatch(EditSequenceConfiguration.save(copySequenceConfiguration));
            } else {
                deleteSequenceConfiguration();
            }
        }
    };

    const deleteSequenceConfiguration = () => {
        if (!DavitUtil.isNullOrUndefined(sequenceConfigurationToEdit) && !DavitUtil.isNullOrUndefined(selectedSequence)) {
            dispatch(EditSequenceConfiguration.delete(sequenceConfigurationToEdit!));
            newSequenceConfiguration(selectedSequence!.sequenceTO.id);
        }
    };

    const setIsStateInSequenceConfiguration = (stateToToggle: StateTO, is: boolean) => {
        if (sequenceConfigurationToEdit) {
            const updatedSequenceConfiguration: SequenceConfigurationTO = DavitUtil.deepCopy(sequenceConfigurationToEdit);
            updatedSequenceConfiguration.stateValues.forEach(sv => {
                if (sv.sequenceStateFk === stateToToggle.id) {
                    sv.value = is;
                }
                return sv;
            });
            dispatch(EditSequenceConfiguration.update(updatedSequenceConfiguration));
        }
    };

    const setSequence = (sequenceId: number | undefined) => {
        if (sequenceId) {
            dispatch(SequenceModelActions.setCurrentSequenceById(sequenceId));
            dispatch(SequenceModelActions.setViewLevel(ViewLevel.sequence));
            newSequenceConfiguration(sequenceId);
        } else {
            dispatch(SequenceModelActions.resetCurrentSequence);
            dispatch(SequenceModelActions.resetCurrentSequenceConfiguration);
            dispatch(editActions.clearObjectToEdit());
        }
    };

    const getUpdateStatesByConfiguration = (states: SequenceStateTO[]): SequenceStateTO[] => {
        const statesToUpdate: SequenceStateTO[] = DavitUtil.deepCopy(states);
        if (selectedSequence && sequenceConfigurationToEdit) {
            statesToUpdate.map(state => {
                sequenceConfigurationToEdit.stateValues.forEach(sv => {
                    if (sv.sequenceStateFk === state.id) {
                        state.isState = sv.value;
                    }
                });
                return state;
            });
        }
        return statesToUpdate;
    };


    const createSequenceInitData = () => {
        if (!DavitUtil.isNullOrUndefined(sequenceConfigurationToEdit)) {
            const copySequenceConfiguration: SequenceConfigurationTO = DavitUtil.deepCopy(sequenceConfigurationToEdit);
            copySequenceConfiguration.initDatas.push(new InitDataTO());
            dispatch(EditSequenceConfiguration.update(copySequenceConfiguration));
        }
    };

    const deleteSequenceInitData = (index: number) => {
        if (!DavitUtil.isNullOrUndefined(sequenceConfigurationToEdit)) {
            const copySequenceConfiguration: SequenceConfigurationTO = DavitUtil.deepCopy(sequenceConfigurationToEdit);
            copySequenceConfiguration.initDatas = copySequenceConfiguration.initDatas.filter((iData, iex) => iex !== index);
            dispatch(EditSequenceConfiguration.update(copySequenceConfiguration));
        }
    };

    const saveSequenceInitData = (initData: InitDataTO, index: number) => {
        if (!DavitUtil.isNullOrUndefined(sequenceConfigurationToEdit)) {
            const copySequenceConfiguration: SequenceConfigurationTO = DavitUtil.deepCopy(sequenceConfigurationToEdit);
            copySequenceConfiguration.initDatas[index] = initData;
            dispatch(EditSequenceConfiguration.update(copySequenceConfiguration));
        }
    };

    const buildSequenceActorDataTableRow = (initData: InitDataTO, index: number): JSX.Element => {
        let copyInitData: InitDataTO = DavitUtil.deepCopy(initData);

        return (
            <tr key={index}>
                <td>
                    <div className="flex content-space-between">
                        <ActorDropDown
                            onSelect={(actor) => {
                                copyInitData.actorFk = actor ? actor.actor.id : -1;
                                saveSequenceInitData(copyInitData, index);
                            }}
                            placeholder={"Select Actor..."}
                            value={copyInitData.actorFk}
                        />
                        <InstanceDropDown
                            onSelect={(dataAndInstance) => {
                                if (!DavitUtil.isNullOrUndefined(dataAndInstance)) {
                                    copyInitData.dataFk = dataAndInstance!.dataFk;
                                    copyInitData.instanceFk = dataAndInstance!.instanceId;
                                    saveSequenceInitData(copyInitData, index);
                                }
                            }}
                            placeholder={"Select Data Instance..."}
                            value={JSON.stringify({
                                dataFk: copyInitData!.dataFk,
                                instanceId: copyInitData!.instanceFk,
                            })
                            }
                        />
                        <DavitDeleteButton onClick={() => {
                            deleteSequenceInitData(index);
                        }}
                                           noConfirm
                        />
                    </div>
                </td>
            </tr>
        );
    };

    // ------------------------------- chain ------------------------------

    const setChain = (chain: ChainTO | undefined) => {
        if (chain) {
            const copyChain: ChainTO = DavitUtil.deepCopy(chain);
            dispatch(SequenceModelActions.setCurrentChain(copyChain));
            // We have to set first the chain, so the slice will set the view level.
            dispatch(SequenceModelActions.setViewLevel(ViewLevel.chain));
            dispatch(EditChainConfiguration.create(copyChain.id));
        } else {
            dispatch(SequenceModelActions.resetCurrentChain);
            dispatch(editActions.clearObjectToEdit());
        }
    };

    const newChainConfiguration = (chainId: number) => {
        dispatch(EditChainConfiguration.create(chainId));
    };

    const setChainConfiguration = (chainConfiguration: ChainConfigurationTO | undefined) => {
        if (chainConfiguration === undefined) {
            if (chainConfigurationToEdit !== null && chainConfigurationToEdit.name === "") {
                deleteSequenceConfiguration();
            } else {
                newChainConfiguration(selectedSequence!.sequenceTO.id);
            }
        } else {
            dispatch(EditChainConfiguration.update(chainConfiguration));
        }
    };

    const deleteChainConfiguration = () => {
        if (!DavitUtil.isNullOrUndefined(chainConfigurationToEdit) && !DavitUtil.isNullOrUndefined(selectedChain)) {
            dispatch(EditChainConfiguration.delete(chainConfigurationToEdit!));
            newSequenceConfiguration(selectedChain!.chain.id);
        }
    };

    const getUpdateChainStatesByConfiguration = (states: ChainStateTO[]): ChainStateTO[] => {
        const statesToUpdate: ChainStateTO[] = DavitUtil.deepCopy(states);
        if (selectedChain && chainConfigurationToEdit) {
            statesToUpdate.map(state => {
                chainConfigurationToEdit.stateValues.forEach(sv => {
                    if (sv.chainStateFk === state.id) {
                        state.isState = sv.value;
                    }
                });
                return state;
            });
        }
        return statesToUpdate;
    };

    const setIsStateInChainConfiguration = (stateToToggle: StateTO, is: boolean) => {
        if (sequenceConfigurationToEdit) {
            const updatedChainConfiguration: ChainConfigurationTO = DavitUtil.deepCopy(sequenceConfigurationToEdit);
            updatedChainConfiguration.stateValues.forEach(sv => {
                if (sv.chainStateFk === stateToToggle.id) {
                    sv.value = is;
                }
                return sv;
            });
            dispatch(EditChainConfiguration.update(updatedChainConfiguration));
        }
    };

    const createChainInitData = () => {
        if (!DavitUtil.isNullOrUndefined(chainConfigurationToEdit)) {
            const copyChainConfiguration: ChainConfigurationTO = DavitUtil.deepCopy(chainConfigurationToEdit);
            copyChainConfiguration.initDatas.push(new InitDataTO());
            dispatch(EditChainConfiguration.update(copyChainConfiguration));
        }
    };

    const deleteChainInitData = (index: number) => {
        if (!DavitUtil.isNullOrUndefined(chainConfigurationToEdit)) {
            const copyChainConfiguration: ChainConfigurationTO = DavitUtil.deepCopy(chainConfigurationToEdit);
            copyChainConfiguration.initDatas = copyChainConfiguration.initDatas.filter((iData, iex) => iex !== index);
            dispatch(EditChainConfiguration.update(copyChainConfiguration));
        }
    };

    const saveChainInitData = (initData: InitDataTO, index: number) => {
        if (!DavitUtil.isNullOrUndefined(chainConfigurationToEdit)) {
            const copyChainConfiguration: ChainConfigurationTO = DavitUtil.deepCopy(chainConfigurationToEdit);
            copyChainConfiguration.initDatas[index] = initData;
            dispatch(EditChainConfiguration.update(copyChainConfiguration));
        }
    };

    const buildChainActorDataTableRow = (initData: InitDataTO, index: number): JSX.Element => {
        let copyInitData: InitDataTO = DavitUtil.deepCopy(initData);

        return (
            <tr key={index}>
                <td>
                    <div className="flex content-space-between">
                        <ActorDropDown
                            onSelect={(actor) => {
                                copyInitData.actorFk = actor ? actor.actor.id : -1;
                                saveChainInitData(copyInitData, index);
                            }}
                            placeholder={"Select Actor..."}
                            value={copyInitData.actorFk}
                        />
                        <InstanceDropDown
                            onSelect={(dataAndInstance) => {
                                if (!DavitUtil.isNullOrUndefined(dataAndInstance)) {
                                    copyInitData.dataFk = dataAndInstance!.dataFk;
                                    copyInitData.instanceFk = dataAndInstance!.instanceId;
                                    saveChainInitData(copyInitData, index);
                                }
                            }}
                            placeholder={"Select Data Instance..."}
                            value={JSON.stringify({
                                dataFk: copyInitData!.dataFk,
                                instanceId: copyInitData!.instanceFk,
                            })
                            }
                        />
                        <DavitDeleteButton onClick={() => {
                            deleteChainInitData(index);
                        }}
                                           noConfirm
                        />
                    </div>
                </td>
            </tr>
        );
    };


    // ---------------------------- ui parts ----------------------------

    const toggleSequenceChain = (toggleValue?: boolean) => {
        setSequenceOptions((toggleValue !== undefined) ? toggleValue : (!sequenceOptions));
        dispatch(SequenceModelActions.resetAll);
    };

    const getSequenceStates = () => {
        if (!DavitUtil.isNullOrUndefined(selectedSequence) && !DavitUtil.isNullOrUndefined(sequenceConfigurationToEdit)) {

            if (selectedSequence!.sequenceStates.length > 0) {
                return (
                    <StateConfigurationView states={getUpdateStatesByConfiguration(selectedSequence!.sequenceStates || [])}
                                            setStateCallback={setIsStateInSequenceConfiguration}
                    />
                );
            }

            if (selectedSequence!.sequenceStates.length === 0) {
                return (
                    <div className="flex flex-center align-center">
                        <h2 className="padding-medium">-- no states declared --</h2>
                    </div>
                );
            }
        }
    };

    const getChainStates = () => {
        if (!DavitUtil.isNullOrUndefined(selectedChain) && !DavitUtil.isNullOrUndefined(chainConfigurationToEdit)) {

            if (chainConfigurationToEdit!.stateValues.length > 0) {
                return (
                    <StateConfigurationView states={getUpdateChainStatesByConfiguration(selectedChain!.chainStates || [])}
                                            setStateCallback={setIsStateInChainConfiguration}
                    />
                );
            }

            if (chainConfigurationToEdit!.stateValues.length === 0) {
                return (
                    <div className="flex flex-center align-center">
                        <h2 className="padding-medium">-- no states declared --</h2>
                    </div>
                );
            }
        }
    };

    const getSequenceInitDatas = () => {
        if (!DavitUtil.isNullOrUndefined(sequenceConfigurationToEdit) && !DavitUtil.isNullOrUndefined(selectedSequence)) {

            if (sequenceConfigurationToEdit!.initDatas.length > 0) {
                return sequenceConfigurationToEdit!.initDatas.map(buildSequenceActorDataTableRow);
            }

            if (sequenceConfigurationToEdit!.initDatas.length === 0) {
                return (
                    <div className="flex flex-center align-center">
                        <h2 className="padding-medium">-- no init datas declared --</h2>
                    </div>
                );
            }
        }
    };

    const getChainInitDatas = () => {
        if (!DavitUtil.isNullOrUndefined(chainConfigurationToEdit) && !DavitUtil.isNullOrUndefined(selectedChain)) {

            if (chainConfigurationToEdit!.initDatas.length > 0) {
                return chainConfigurationToEdit!.initDatas.map(buildChainActorDataTableRow);
            }

            if (chainConfigurationToEdit!.initDatas.length === 0) {
                return (
                    <div className="flex flex-center align-center">
                        <h2 className="padding-medium">-- no init datas declared --</h2>
                    </div>
                );
            }
        }
    };

    const getNote = (): string => {
        let noteToReturn: string = "";
        if (!DavitUtil.isNullOrUndefined(selectedSequence)) {
            noteToReturn = selectedSequence!.sequenceTO!.note;
        }
        if (!DavitUtil.isNullOrUndefined(selectedChain)) {
            noteToReturn = selectedChain!.chain.note;
        }
        return noteToReturn;
    };

// ============================================== configuration panel ===============================================

    return (
        <div className="configurationPanel border border-medium">

            {/*----- Header -----*/}
            <div className="configurationPanelHeader content-space-around align-center padding-medium">

                <div className="flex align-center">
                    <h3 className={sequenceOptions ? "clickAble" : "selectedColor"}
                        onClick={() => toggleSequenceChain(false)}
                    >Chain</h3>
                    <div className="padding-horizontal-m">

                        <DavitToggleButton
                            toggle={() => toggleSequenceChain()}
                            value={sequenceOptions}
                        />
                    </div>
                    <h3 className={sequenceOptions ? "selectedColor" : "clickAble"}
                        onClick={() => toggleSequenceChain(true)}
                    >Sequence</h3>
                </div>

                {sequenceOptions && <SequenceDropDown onSelect={(sequence) => {
                    setSequence(sequence?.id);
                }}
                                                      value={selectedSequence?.sequenceTO.id}

                />}
                {!sequenceOptions && <ChainDropDown onSelect={setChain}
                                                    value={selectedChain?.chain.id}
                />}

                {(selectedSequence !== null || selectedChain !== null)
                && < DavitShowMoreButton onClick={setShowMore}
                                         show={showMore}
                                         size={ElementSize.medium}
                />}

            </div>

            {/* --------------- Body ---------------*/}

            {/*------------- sequence ------------- */}
            {selectedSequence && showMore &&
            <div className="configurationBody flex border-top border-medium">

                <div className="configurationStateColumn flex flex-column width-fluid">

                    {/*------ note -----*/}
                    <div className="flex flex-center padding-small border-bottom border-medium">
                        <NoteIcon size="2x"
                                  className="margin-medium padding-small border border-medium"
                        />
                        <textarea className="noteTextarea border border-medium padding-medium"
                                  value={getNote()}
                                  readOnly
                        />
                    </div>

                    {/*------ configuration ------*/}
                    <div className="flex content-space-around align-center padding-small border-bottom border-medium">

                        <h2>Configuration</h2>

                        {selectedSequence && <SequenceConfigurationDropDown
                            onSelectCallback={setSequenceConfiguration}
                            sequenceId={selectedSequence.sequenceTO.id}
                            selectedSequenceConfiguration={sequenceConfigurationToEdit?.id}
                        />}

                        {sequenceConfigurationToEdit?.id !== -1 &&
                        <DavitDeleteButton onClick={deleteSequenceConfiguration} />}

                    </div>

                    <div>
                        {/*/!*----- States -----*!/*/}
                        <div className="configurationHeader flex flex-center align-center">
                            <h1 className="padding-medium">{selectedSequence ? "Sequence States" : "Chain States"}</h1>
                        </div>

                        {/*    State*/}
                        <div className="configList padding-bottom-l">
                            {getSequenceStates()}
                            {getChainStates()}
                        </div>

                    </div>

                    <div className="flex-inline flex-wrap flex-column">
                        {/*    Data setup*/}
                        <div className="configurationHeader flex flex-center align-center">
                            <h1 className="padding-medium">Data-Setup</h1>
                        </div>

                        <div className="configurationPanelHeader content-space-around align-center border-bottom border-medium">
                            <label>Actor</label>
                            <label>Data Instance</label>
                            <DavitAddButton onClick={selectedSequence ? createSequenceInitData : createChainInitData} />
                        </div>

                        <div className="configList padding-bottom-l">
                            {getSequenceInitDatas()}
                            {getChainInitDatas()}
                        </div>

                    </div>
                    <div className="flex content-space-around padding-small border-top border-medium">

                        <DavitIconButton onClick={() => setShowSaveConfiguration(true)}
                                         iconLeft={false}
                                         iconName={DavitIcons.save}
                                         className="greenBorder"
                        >Save Config</DavitIconButton>

                        <DavitIconButton onClick={runCalc}
                                         iconLeft={false}
                                         iconName={DavitIcons.play}
                                         className="calcButton"
                        >Calculate</DavitIconButton>
                    </div>
                </div>
            </div>}

            {/*------------- chain ------------- */}

            {selectedChain && showMore &&

            <div className="configurationBody flex-column border-top border-medium">

                {/*------ note -----*/}
                <div className="flex flex-center padding-small  border-bottom border-medium">
                    <NoteIcon size="2x"
                              className="margin-medium padding-small border border-medium"
                    />
                    <textarea className="noteTextarea border border-medium padding-medium"
                              value={getNote()}
                              readOnly
                    />
                </div>

                {/*------ configuration ------*/}
                <div className="flex content-space-around align-center padding-small">

                    <h2>Configuration</h2>

                    {selectedChain && <ChainConfigurationDropDown
                        onSelectCallback={setChainConfiguration}
                        chainId={selectedChain.chain.id}
                        selectedChainConfiguration={chainConfigurationToEdit?.id}
                    />}

                    {chainConfigurationToEdit?.id !== -1 &&
                    <DavitDeleteButton onClick={deleteChainConfiguration} />}

                </div>

                <div className="flex border-top border-medium">

                    <div id="column1"
                         className="configurationSequenceChainColumn"
                    >

                        {/*---- overview -----*/}
                        <ConfigurationSelectButton label="Overview"
                                                   onClick={() => {
                                                   }}
                                                   isSelected={false}
                        />

                        {/*---- chain -----*/}
                        <ConfigurationSelectButton label={selectedChain.chain.name}
                                                   onClick={() => {
                                                   }}
                                                   isSelected={false}
                        />

                        {/*---- links -----*/}
                        {selectedChain.links.map((link, index) => {
                            return (<ConfigurationSelectButton key={index}
                                                               label={link.chainLink.name}
                                                               onClick={() => {
                                                               }}
                                                               isSelected={false}
                            />);
                        })}

                        {/*---- decisions -----*/}
                        {selectedChain.decisions.map((decision, index) => {
                            return (<ConfigurationSelectButton key={index}
                                                               label={decision.name}
                                                               onClick={() => {
                                                               }}
                                                               isSelected={false}
                            />);
                        })}

                    </div>

                    <div id="column2"
                         className="border-left border-medium"
                    >

                        <div>
                            {/*/!*----- States -----*!/*/}
                            <div className="configurationHeader flex flex-center align-center">
                                <h1 className="padding-medium">{selectedSequence ? "Sequence States" : "Chain States"}</h1>
                            </div>

                            {/*    State*/}
                            <div className="configList padding-bottom-l">
                                {getSequenceStates()}
                                {getChainStates()}
                            </div>

                        </div>

                        <div className="flex-inline flex-wrap flex-column">
                            {/*    Data setup*/}
                            <div className="configurationHeader flex flex-center align-center">
                                <h1 className="padding-medium">Data-Setup</h1>
                            </div>

                            <div className="configurationPanelHeader content-space-around align-center border-bottom border-medium">
                                <label>Actor</label>
                                <label>Data Instance</label>
                                <DavitAddButton onClick={selectedSequence ? createSequenceInitData : createChainInitData} />
                            </div>

                            <div className="configList padding-bottom-l">
                                {getSequenceInitDatas()}
                                {getChainInitDatas()}
                            </div>

                        </div>

                    </div>

                </div>
                <div className="flex content-space-around padding-small border-top border-medium">

                    <DavitIconButton onClick={() => setShowSaveConfiguration(true)}
                                     iconLeft={false}
                                     iconName={DavitIcons.save}
                                     className="greenBorder"
                    >Save Config</DavitIconButton>

                    <DavitIconButton onClick={runCalc}
                                     iconLeft={false}
                                     iconName={DavitIcons.play}
                                     className="calcButton"
                    >Calculate</DavitIconButton>
                </div>
            </div>}

            {showSaveConfiguration && <SaveConfigurationModal onSaveCallback={saveSequenceConfiguration}
                                                              onCloseCallback={() => setShowSaveConfiguration(false)}
                                                              name={sequenceConfigurationToEdit?.name || ""}
            />}
        </div>);
};
