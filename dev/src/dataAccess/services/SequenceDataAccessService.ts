import { DavitUtil } from "../../utils/DavitUtil";
import { ChainCTO } from "../access/cto/ChainCTO";
import { ChainlinkCTO } from "../access/cto/ChainlinkCTO";
import { DataSetupCTO } from "../access/cto/DataSetupCTO";
import { SequenceCTO } from "../access/cto/SequenceCTO";
import { SequenceStepCTO } from "../access/cto/SequenceStepCTO";
import { ActionTO } from "../access/to/ActionTO";
import { ChainDecisionTO } from "../access/to/ChainDecisionTO";
import { ChainlinkTO } from "../access/to/ChainlinkTO";
import { ChainTO } from "../access/to/ChainTO";
import { DataSetupTO } from "../access/to/DataSetupTO";
import { DecisionTO } from "../access/to/DecisionTO";
import { InitDataTO } from "../access/to/InitDataTO";
import { SequenceStepTO } from "../access/to/SequenceStepTO";
import { SequenceTO } from "../access/to/SequenceTO";
import { GoToTypes } from "../access/types/GoToType";
import { ActionRepository } from "../repositories/ActionRepository";
import { ChainDecisionRepository } from "../repositories/ChainDecisionRepository";
import { ChainLinkRepository } from "../repositories/ChainLinkRepository";
import { ChainRepository } from "../repositories/ChainRepository";
import { DataSetupRepository } from "../repositories/DataSetupRepository";
import { DecisionRepository } from "../repositories/DecisionRepository";
import { InitDataRepository } from "../repositories/InitDataRepository";
import { SequenceRepository } from "../repositories/SequenceRepository";
import { SequenceStepRepository } from "../repositories/SequenceStepRepository";
import { CheckHelper } from "../util/CheckHelper";

export const SequenceDataAccessService = {
    // ---------------------------------------------------------- Sequence ----------------------------------------------------------

    findSequenceCTO(sequenceId: number): SequenceCTO {
        return createSequenceCTO(SequenceRepository.find(sequenceId));
    },

    findSequenceTO(sequenceId: number): SequenceTO | undefined {
        return SequenceRepository.find(sequenceId);
    },

    findAll(): SequenceTO[] {
        return SequenceRepository.findAll();
    },

    saveSequenceCTO(sequence: SequenceCTO): SequenceCTO {
        CheckHelper.nullCheck(sequence, "sequenceCTO");
        const sequenceTO: SequenceTO = SequenceRepository.save(sequence.sequenceTO);
        sequence.sequenceStepCTOs.forEach((step) => {
            if (step.squenceStepTO.sequenceFk === -1) {
                step.squenceStepTO.sequenceFk = sequenceTO.id;
            }
            this.saveSequenceStep(step);
        });
        return createSequenceCTO(sequenceTO);
    },

    saveSequenceTO(sequenceTO: SequenceTO): SequenceTO {
        CheckHelper.nullCheck(sequenceTO, "sequenceTO");
        const savedSequenceTO: SequenceTO = SequenceRepository.save(sequenceTO);
        return savedSequenceTO;
    },

    deleteSequenceTO(sequenceTO: SequenceTO): SequenceTO {
        CheckHelper.nullCheck(sequenceTO, "sequenceTO");
        const tempCTO: SequenceCTO = createSequenceCTO(sequenceTO);
        tempCTO.sequenceStepCTOs.forEach((step) => SequenceStepRepository.delete(step.squenceStepTO));
        tempCTO.decisions.forEach((cond) => DecisionRepository.delete(cond));
        return SequenceRepository.delete(sequenceTO);
    },

    deleteSequenceCTO(sequence: SequenceCTO): SequenceCTO {
        CheckHelper.nullCheck(sequence.sequenceTO, "sequenceTO");

        // Remove all goto id's (FK's)
        sequence.decisions.forEach((decision) => {
            if (decision.ifGoTo.type === GoToTypes.STEP || decision.ifGoTo.type === GoToTypes.DEC) {
                decision.ifGoTo.id = -1;
                this.saveDecision(decision);
            }
            if (decision.elseGoTo.type === GoToTypes.STEP || decision.elseGoTo.type === GoToTypes.DEC) {
                decision.elseGoTo.id = -1;
                this.saveDecision(decision);
            }
        });

        sequence.sequenceStepCTOs.forEach((step) => {
            if (step.squenceStepTO.goto.type === GoToTypes.STEP || step.squenceStepTO.goto.type === GoToTypes.DEC) {
                step.squenceStepTO.goto.id = -1;
                this.saveSequenceStep(step);
            }
        });

        // Delete decisions and steps
        sequence.decisions.forEach(this.deleteDecision);
        sequence.sequenceStepCTOs.forEach(this.deleteSequenceStep);

        this.deleteSequenceTO(sequence.sequenceTO);
        return sequence;
    },

    // ---------------------------------------------------------- ROOT ----------------------------------------------------------

    setRoot(sequenceId: number, id: number, isDecision: boolean): SequenceStepTO | DecisionTO {
        let root: SequenceStepTO | DecisionTO | null = null;
        const copyDecisions: DecisionTO[] = DecisionRepository.findAllForSequence(sequenceId);
        const copySteps: SequenceStepTO[] = SequenceStepRepository.findAllForSequence(sequenceId);
        // set root
        copyDecisions.forEach((decision) => {
            decision.root = false;
            if (isDecision) {
                if (decision.id === id) {
                    decision.root = true;
                    root = decision;
                }
            }
        });
        copySteps.forEach((step) => {
            step.root = false;
            if (!isDecision) {
                if (step.id === id) {
                    step.root = true;
                    root = step;
                }
            }
        });
        // save
        copyDecisions.forEach((decision) => DecisionRepository.save(decision));
        copySteps.forEach((step) => SequenceStepRepository.save(step));

        if (root === null) {
            throw Error("no root is set!");
        } else {
            return root;
        }
    },

    setChainRoot(chainId: number, id: number, isDecision: boolean): ChainlinkTO | ChainDecisionTO {
        let root: ChainlinkTO | ChainDecisionTO | null = null;
        const copyDecisions: ChainDecisionTO[] = ChainDecisionRepository.findAllForChain(chainId);
        const copySteps: ChainlinkTO[] = ChainLinkRepository.findAllForChain(chainId);
        // set root
        copyDecisions.forEach((decision) => {
            if (isDecision) {
                if (decision.id === id) {
                    root = decision;
                }
            }
        });
        copySteps.forEach((step) => {
            step.root = false;
            if (!isDecision) {
                if (step.id === id) {
                    step.root = true;
                    root = step;
                }
            }
        });
        // save
        copyDecisions.forEach((decision) => ChainDecisionRepository.save(decision));
        copySteps.forEach((step) => ChainLinkRepository.save(step));

        if (root === null) {
            throw Error("no root is set!");
        } else {
            return root;
        }
    },

    // ---------------------------------------------------------- Sequence step ----------------------------------------------------------

    saveSequenceStep(sequenceStep: SequenceStepCTO): SequenceStepCTO {
        CheckHelper.nullCheck(sequenceStep, "sequenceStep");
        // TODO: move this in a CheckSaveDecision class.
        if (sequenceStep.squenceStepTO.sequenceFk === -1) {
            throw new Error("Sequence step sequenceFk is '-1'!");
        }
        const persistedActions: ActionTO[] = ActionRepository.findAllForStep(sequenceStep.squenceStepTO.id);
        const actionsToDelete: ActionTO[] = persistedActions.filter(
            (action) => !sequenceStep.actions.some((cDCTO) => cDCTO.id === action.id),
        );
        actionsToDelete.map((cptd) => cptd.id).forEach(ActionRepository.delete);

        const savedStep: SequenceStepTO = SequenceStepRepository.save(sequenceStep.squenceStepTO);

        sequenceStep.actions.forEach((action) => {
            // action.sequenceStepFk = savedStep.id;
            ActionRepository.save(action);
        });
        return createSequenceStepCTO(savedStep);
    },

    deleteSequenceStep(sequenceStep: SequenceStepCTO): SequenceStepCTO {
        CheckHelper.nullCheck(sequenceStep, "step");
        sequenceStep.actions.map((action) => ActionRepository.delete(action.id));
        SequenceStepRepository.delete(sequenceStep.squenceStepTO);
        const seqSteps: SequenceStepTO[] = DavitUtil.deepCopy(
            SequenceStepRepository.findAllForSequence(sequenceStep.squenceStepTO.sequenceFk),
        );
        seqSteps.sort((a, b) => a.index - b.index);
        seqSteps.forEach((step, index) => (step.index = index + 1));
        seqSteps.forEach(SequenceStepRepository.save);
        return sequenceStep;
    },

    findSequenceStepCTO(id: number): SequenceStepCTO {
        const step: SequenceStepTO | undefined = SequenceStepRepository.find(id);
        return createSequenceStepCTO(step);
    },

    // ---------------------------------------------------------- Decision ----------------------------------------------------------

    saveDecision(decision: DecisionTO): DecisionTO {
        return DecisionRepository.save(decision);
    },

    deleteDecision(decision: DecisionTO): DecisionTO {
        return DecisionRepository.delete(decision);
    },

    findDecision(id: number): DecisionTO {
        const decision: DecisionTO | undefined = DecisionRepository.find(id);
        if (decision === undefined) {
            throw Error("Decision with id: " + id + " dos not exists!");
        }
        return decision;
    },

    // ---------------------------------------------------------- Action ----------------------------------------------------------

    saveActionTO(action: ActionTO): ActionTO {
        CheckHelper.nullCheck(action, "actionTO");
        const copyAction: ActionTO = DavitUtil.deepCopy(action);
        const savedActionTO: ActionTO = ActionRepository.save(copyAction);
        return savedActionTO;
    },

    deleteAction(action: ActionTO): ActionTO {
        CheckHelper.nullCheck(action, "action");
        ActionRepository.delete(action.id);
        return action;
    },

    // ---------------------------------------------------------- Data Setup ----------------------------------------------------------

    findAllDataSetup(): DataSetupTO[] {
        return DataSetupRepository.findAll();
    },

    findDatSetupCTO(dataId: number): DataSetupCTO {
        return createDataSetupCTO(DataSetupRepository.find(dataId));
    },

    saveDataSetup(dataSetup: DataSetupTO): DataSetupTO {
        CheckHelper.nullCheck(dataSetup, "dataSetup");
        const dataSetupTO: DataSetupTO = DataSetupRepository.save(dataSetup);
        return dataSetupTO;
    },

    saveDataSetupCTO(dataSetupCTO: DataSetupCTO): DataSetupCTO {
        CheckHelper.nullCheck(dataSetupCTO, "dataSetupCTO");
        const copyDataSetupCTO: DataSetupCTO = DavitUtil.deepCopy(dataSetupCTO);
        const savedDataSetupTO: DataSetupTO = DataSetupRepository.save(dataSetupCTO.dataSetup);
        // remove old init data.
        InitDataRepository.findAllForSetup(dataSetupCTO.dataSetup.id).forEach((initData) =>
            InitDataRepository.delete(initData.id),
        );
        // update and save new init data.
        copyDataSetupCTO.initDatas.forEach((initData) => {
            initData.dataSetupFk = savedDataSetupTO.id;
            InitDataRepository.save(initData);
        });
        const savedInitDatas: InitDataTO[] = InitDataRepository.findAllForSetup(savedDataSetupTO.id);
        return {dataSetup: savedDataSetupTO, initDatas: savedInitDatas};
    },

    deleteDataSetup(dataSetup: DataSetupCTO): DataSetupCTO {
        CheckHelper.nullCheck(dataSetup, "dataSetup");
        dataSetup.initDatas.forEach((initData) => InitDataRepository.delete(initData.id));
        DataSetupRepository.delete(dataSetup.dataSetup);
        return dataSetup;
    },

    // ---------------------------------------------------------- Init Data ----------------------------------------------------------
    findAllInitDatas(): InitDataTO[] {
        return InitDataRepository.findAll();
    },

    findInitData(id: number): InitDataTO {
        const initData: InitDataTO | undefined = InitDataRepository.find(id);
        if (!initData) {
            throw new Error("Could not find Init Data with id: " + id);
        } else {
            return initData;
        }
    },

    saveInitData(initData: InitDataTO): InitDataTO {
        CheckHelper.nullCheck(initData, "initData");
        const savedInitData: InitDataTO = InitDataRepository.save(initData);
        return savedInitData;
    },

    deleteInitData(id: number): InitDataTO {
        return InitDataRepository.delete(id);
    },

    // ---------------------------------------------------------- Chain ----------------------------------------------------------
    findAllChains(): ChainTO[] {
        return ChainRepository.findAll();
    },

    getChainCTO(chain: ChainTO): ChainCTO {
        return crateChainCTO(chain);
    },

    saveChainTO(chain: ChainTO): ChainTO {
        return ChainRepository.saveTO(chain);
    },

    deleteChain(chain: ChainTO): ChainTO {
        const linksToDelete: ChainlinkTO[] = ChainLinkRepository.findAllForChain(chain.id);
        const decisionsToDelete: ChainDecisionTO[] = ChainDecisionRepository.findAllForChain(chain.id);
        linksToDelete.forEach((link) => ChainLinkRepository.delete(link));
        decisionsToDelete.forEach((dec) => ChainDecisionRepository.delete(dec));
        return ChainRepository.delete(chain);
    },

    saveChainlink(link: ChainlinkTO): ChainlinkTO {
        return ChainLinkRepository.save(link);
    },

    findAllChainLinks(): ChainlinkTO[] {
        return ChainLinkRepository.findAll();
    },

    deleteChainTO(chainlink: ChainlinkTO): ChainlinkTO {
        return ChainLinkRepository.delete(chainlink);
    },

    saveChainDecision(decision: ChainDecisionTO): ChainDecisionTO {
        return ChainDecisionRepository.save(decision);
    },

    findAllChainDecisions(): ChainDecisionTO[] {
        return ChainDecisionRepository.findAll();
    },

    deleteChainDecision(decision: ChainDecisionTO): ChainDecisionTO {
        return ChainDecisionRepository.delete(decision);
    },

    findChainLink(id: number): ChainlinkTO {
        const link: ChainlinkTO | undefined = ChainLinkRepository.find(id);
        if (link) {
            return link;
        } else {
            throw Error("could not find chain link with id: " + id);
        }
    },

    findChainDecision(id: number): ChainDecisionTO {
        const decision: ChainDecisionTO | undefined = ChainDecisionRepository.find(id);
        if (decision) {
            return decision;
        } else {
            throw Error("could not find chain decision with id: " + id);
        }
    },
};
// ======================================================== PRIVATE ========================================================

const createSequenceCTO = (sequence: SequenceTO | undefined): SequenceCTO => {
    CheckHelper.nullCheck(sequence, "sequence");
    const sequenceStepCTOs: SequenceStepCTO[] = SequenceStepRepository.findAllForSequence(sequence!.id).map(
        createSequenceStepCTO,
    );
    sequenceStepCTOs.sort((step1, step2) => step1.squenceStepTO.index - step2.squenceStepTO.index);
    const decisions: DecisionTO[] = DecisionRepository.findAllForSequence(sequence!.id);
    return {sequenceTO: sequence!, sequenceStepCTOs: sequenceStepCTOs, decisions: decisions};
};

const createSequenceStepCTO = (sequenceStepTO: SequenceStepTO | undefined): SequenceStepCTO => {
    CheckHelper.nullCheck(sequenceStepTO, "sequenceStepTO");
    const actionTOs: ActionTO[] = ActionRepository.findAllForStep(sequenceStepTO!.id);
    const sortByIndexActions: ActionTO[] = actionTOs.sort(function (a, b) {
        return a.index - b.index;
    });
    return {
        squenceStepTO: sequenceStepTO!,
        actions: sortByIndexActions,
    };
};

const createDataSetupCTO = (dataSetupTO: DataSetupTO | undefined): DataSetupCTO => {
    CheckHelper.nullCheck(dataSetupTO, "dataSetupTO");
    const initDatas: InitDataTO[] = InitDataRepository.findAllForSetup(dataSetupTO!.id);
    return {
        dataSetup: dataSetupTO!,
        initDatas: initDatas,
    };
};

const createChainLinkCTO = (link: ChainlinkTO | undefined): ChainlinkCTO => {
    CheckHelper.nullCheck(link, "chainlink");
    const chainLinkCTO: ChainlinkCTO = new ChainlinkCTO();
    chainLinkCTO.chainLink = link!;
    const dataSetupTO: DataSetupTO | undefined = DataSetupRepository.find(link!.dataSetupFk);
    const sequenceTO: SequenceTO | undefined = SequenceRepository.find(link!.sequenceFk);
    if (dataSetupTO && sequenceTO) {
        const dataSetupCTO: DataSetupCTO = createDataSetupCTO(dataSetupTO);
        const sequenceCTO: SequenceCTO = createSequenceCTO(sequenceTO);
        chainLinkCTO.dataSetup = dataSetupCTO;
        chainLinkCTO.sequence = sequenceCTO;
    }
    return chainLinkCTO;
};

const crateChainCTO = (chain: ChainTO): ChainCTO => {
    CheckHelper.nullCheck(chain, "chainTO");
    const copyChain: ChainTO = DavitUtil.deepCopy(chain);
    const chainCTO: ChainCTO = new ChainCTO();
    const chainLinkTOs: ChainlinkTO[] | undefined = ChainLinkRepository.findAllForChain(copyChain.id);
    let chainLinkCTOs: ChainlinkCTO[] = [];
    if (chainLinkTOs) {
        chainLinkCTOs = chainLinkTOs.map((link) => createChainLinkCTO(link));
    }
    const chainDecisions: ChainDecisionTO[] = ChainDecisionRepository.findAllForChain(copyChain.id);
    chainCTO.chain = copyChain;
    chainCTO.links = chainLinkCTOs;
    chainCTO.decisions = chainDecisions;
    return chainCTO;
};
