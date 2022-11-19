import React, { FunctionComponent, useState } from "react";
import { ChainStateTO } from "../../../dataAccess/access/to/ChainStateTO";
import { InitDataTO } from "../../../dataAccess/access/to/InitDataTO";
import { SequenceStateTO } from "../../../dataAccess/access/to/SequenceStateTO";
import { SequenceModelActions } from "../../../slices/SequenceModelSlice";
import { useAppDispatch } from "../../../store";
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
import { useConfigurationViewModel } from "./models/ConfigurationViewModel";

export interface ConfigurationPanelProps {

}

export const ConfigurationPanel: FunctionComponent<ConfigurationPanelProps> = () => {

    const dispatch = useAppDispatch();

    const [sequenceOptions, setSequenceOptions] = useState<boolean>(false);
    const [showMore, setShowMore] = useState<boolean>(true);
    const [showSaveConfiguration, setShowSaveConfiguration] = useState<boolean>(false);

    const {
        runCalc,
        sequenceConfigurationToEdit,
        selectedSequence,
        chainConfigurationToEdit,
        selectedChain,
        setSequenceConfiguration,
        deleteSequenceConfiguration,
        saveSequenceConfiguration,
        setSequence,
        setIsStateInSequenceConfiguration,
        createSequenceInitData,
        deleteSequenceInitData,
        saveSequenceInitData,
        setChain,
        setChainConfiguration,
        deleteChainConfiguration,
        setIsStateInChainConfiguration,
        createChainInitData,
        deleteChainInitData,
        saveChainInitData,
        getNote,
        saveChainConfig
    } = useConfigurationViewModel();


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


    const buildSequenceActorDataTableRow = (initData: InitDataTO, index: number): JSX.Element => {

        const copyInitData: InitDataTO = DavitUtil.deepCopy(initData);

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


    const buildChainActorDataTableRow = (initData: InitDataTO, index: number): JSX.Element => {
        const copyInitData: InitDataTO = DavitUtil.deepCopy(initData);

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


    const toggleSequenceChain = (toggleValue?: boolean) => {
        setSequenceOptions((toggleValue !== undefined) ? toggleValue : (!sequenceOptions));
        dispatch(SequenceModelActions.resetAll);
    };

    const getSequenceStatesView = () => {
        if (!DavitUtil.isNullOrUndefined(selectedSequence)
            && !DavitUtil.isNullOrUndefined(sequenceConfigurationToEdit)) {
            selectedStateView(selectedSequence!.sequenceStates);
        }
    };

    const selectedStateView = (sequenceStates: SequenceStateTO[]) => {
        if (sequenceStates.length > 0) {
            return (
                <StateConfigurationView
                    states={getUpdateStatesByConfiguration(sequenceStates || [])}
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
    };

    const getChainStatesView = () => {
        if (selectedChain && chainConfigurationToEdit) {

            if (chainConfigurationToEdit.stateValues.length > 0) {
                return (
                    <StateConfigurationView
                        states={getUpdateChainStatesByConfiguration(selectedChain.chainStates || [])}
                        setStateCallback={setIsStateInChainConfiguration}
                    />
                );
            }

            if (chainConfigurationToEdit.stateValues.length === 0) {
                return (
                    <div className="flex flex-center align-center">
                        <h2 className="padding-medium">-- no states declared --</h2>
                    </div>
                );
            }
        }
    };

    const getSequenceInitDatas = () => {
        if (!DavitUtil.isNullOrUndefined(sequenceConfigurationToEdit)
            && !DavitUtil.isNullOrUndefined(selectedSequence)) {

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


// =================================== configuration panel ======================================

    return (
        <div className="configurationPanel border border-medium">

            {/*----- Header -----*/}
            <div className="configurationPanelHeader content-space-around align-center padding-medium">

                <div className="flex align-center">
                    <h3 className={sequenceOptions ? "clickAble" : "selectedColor"}
                        onClick={() => toggleSequenceChain(false)}
                    >Chain
                    </h3>
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

                {sequenceOptions && <SequenceDropDown
                    onSelect={(sequence) => {
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
                                <h1 className="padding-medium">
                                    {selectedSequence ? "Sequence States" : "Chain States"}
                                </h1>
                            </div>

                            {/*    State*/}
                            <div className="configList padding-bottom-l">
                                {getSequenceStatesView()}
                                {getChainStatesView()}
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

                        <div id="config-chain-navigation-menu"
                             className="configurationSequenceChainColumn"
                        >

                            {/*TODO: go one here*/}

                            {/*---- overview -----*/}
                            <ConfigurationSelectButton label="Overview"
                                                       onClick={() => {
                                                           // TODO: remove filters
                                                       }}
                                                       isSelected={false}
                            />

                            {/*---- chain -----*/}
                            <ConfigurationSelectButton label={selectedChain.chain.name}
                                                       onClick={() => {
                                                           // TODO: filter on chain states
                                                       }}
                                                       isSelected={false}
                            />

                            {/*---- links -----*/}
                            {selectedChain.links.map((link, index) => {
                                return (<ConfigurationSelectButton key={index}
                                                                   label={link.chainLink.name}
                                                                   onClick={() => {
                                                                       //TODO: filter on link states
                                                                   }}
                                                                   isSelected={false}
                                />);
                            })}

                        </div>

                        <div id="config-chain-sates-data-setup"
                             className="border-left border-medium"
                        >

                            <div>
                                {/*/!*----- States -----*!/*/}
                                <div className="configurationHeader flex flex-center align-center">
                                    <h1 className="padding-medium">
                                        {selectedSequence ? "Sequence States" : "Chain States"}
                                    </h1>
                                </div>

                                {/*    State*/}
                                <div className="configList padding-bottom-l">
                                    {selectedChain && selectedStateView(selectedChain.links.flatMap(link => link.sequence.sequenceStates))}
                                    {getChainStatesView()}
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

            {showSaveConfiguration && selectedSequence && <SaveConfigurationModal
                onSaveCallback={saveSequenceConfiguration}
                onCloseCallback={() => setShowSaveConfiguration(false)}
                name={sequenceConfigurationToEdit?.name || ""}
                type="Sequence"
            />}
            {showSaveConfiguration && chainConfigurationToEdit && <SaveConfigurationModal
                onSaveCallback={saveChainConfig}
                onCloseCallback={() => setShowSaveConfiguration(false)}
                name={chainConfigurationToEdit.name || ""}
                type="Chain"
            />}
        </div>);
};
