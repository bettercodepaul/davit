import { useDispatch, useSelector } from "react-redux";
import { ChainCTO } from "../../../../dataAccess/access/cto/ChainCTO";
import { SequenceCTO } from "../../../../dataAccess/access/cto/SequenceCTO";
import { ChainConfigurationTO } from "../../../../dataAccess/access/to/ChainConfigurationTO";
import { ChainTO } from "../../../../dataAccess/access/to/ChainTO";
import { InitDataTO } from "../../../../dataAccess/access/to/InitDataTO";
import { SequenceConfigurationTO } from "../../../../dataAccess/access/to/SequenceConfigurationTO";
import { StateTO } from "../../../../dataAccess/access/to/StateTO";
import { editActions, EditActions, editSelectors } from "../../../../slices/EditSlice";
import { SequenceModelActions, sequenceModelSelectors, ViewLevel } from "../../../../slices/SequenceModelSlice";
import { EditChainConfiguration } from "../../../../slices/thunks/ChainConfigurationThunks";
import { EditSequenceConfiguration } from "../../../../slices/thunks/SequenceConfigurationThunks";
import { useAppDispatch } from "../../../../store";
import { DavitUtil } from "../../../../utils/DavitUtil";

export const useConfigurationViewModel = () => {

    const dispatch = useAppDispatch();

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

    const newSequenceConfiguration = (sequenceId: number) => {
        dispatch(EditSequenceConfiguration.create(sequenceId));
    };

    // ------------------------------- sequence ------------------------------

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

    const deleteSequenceConfiguration = () => {
        if (!DavitUtil.isNullOrUndefined(sequenceConfigurationToEdit)
            && !DavitUtil.isNullOrUndefined(selectedSequence)) {

            dispatch(EditSequenceConfiguration.delete(sequenceConfigurationToEdit!));
            newSequenceConfiguration(selectedSequence!.sequenceTO.id);
        }
    };

    const saveSequenceConfiguration = (name?: string) => {
        if (!DavitUtil.isNullOrUndefined(sequenceConfigurationToEdit)
            && !DavitUtil.isNullOrUndefined(selectedSequence)) {

            if (sequenceConfigurationToEdit!.name !== "" || (name !== "" && name !== undefined)) {
                const copySequenceConfiguration: SequenceConfigurationTO =
                    DavitUtil.deepCopy(sequenceConfigurationToEdit);
                // set sequence id
                copySequenceConfiguration.sequenceFk = selectedSequence!.sequenceTO.id;
                // set new name if given
                if (name !== "" && name !== undefined) {
                    copySequenceConfiguration.name = name;
                }
                // remove empty init data's
                copySequenceConfiguration.initDatas =
                    copySequenceConfiguration.initDatas
                        .filter(initD => initD.actorFk !== -1 && initD.dataFk !== -1 && initD.instanceFk !== -1);
                // save sequence configuration
                dispatch(EditSequenceConfiguration.save(copySequenceConfiguration));
            } else {
                deleteSequenceConfiguration();
            }
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

    const setIsStateInSequenceConfiguration = (stateToToggle: StateTO, is: boolean) => {
        if (sequenceConfigurationToEdit) {
            const updatedSequenceConfiguration: SequenceConfigurationTO =
                DavitUtil.deepCopy(sequenceConfigurationToEdit);
            updatedSequenceConfiguration.stateValues.forEach(sv => {
                if (sv.sequenceStateFk === stateToToggle.id) {
                    sv.value = is;
                }
                return sv;
            });
            dispatch(EditSequenceConfiguration.update(updatedSequenceConfiguration));
        }
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
            copySequenceConfiguration.initDatas =
                copySequenceConfiguration.initDatas.filter((iData, iex) => iex !== index);
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
            copyChainConfiguration.initDatas =
                copyChainConfiguration.initDatas.filter((iData, iex) => iex !== index);
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

    return {
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
    };

};