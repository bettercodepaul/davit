import { Carv2Util } from "../../utils/Carv2Util";
import { ActionCTO } from "../access/cto/ActionCTO";
import { ComponentCTO } from "../access/cto/ComponentCTO";
import { SequenceCTO } from "../access/cto/SequenceCTO";
import { SequenceStepCTO } from "../access/cto/SequenceStepCTO";
import { ActionTO } from "../access/to/ActionTO";
import { ComponentTO } from "../access/to/ComponentTO";
import { DataTO } from "../access/to/DataTO";
import { SequenceStepTO } from "../access/to/SequenceStepTO";
import { SequenceTO } from "../access/to/SequenceTO";
import { ActionRepository } from "../repositories/ActionRepository";
import { SequenceRepository } from "../repositories/SequenceRepository";
import { SequenceStepRepository } from "../repositories/SequenceStepRepository";
import { CheckHelper } from "../util/CheckHelper";
import { ComponentDataAccessService } from "./ComponentDataAccessService";
import { DataDataAccessService } from "./DataDataAccessService";

export const SequenceDataAccessService = {
  find(sequenceId: number): SequenceCTO {
    return createSequenceCTO(SequenceRepository.find(sequenceId));
  },

  findAll(): SequenceCTO[] {
    return SequenceRepository.findAll().map((sequenceTO) => createSequenceCTO(sequenceTO));
  },

  save(sequence: SequenceCTO): SequenceCTO {
    const sequenceTO: SequenceTO = SequenceRepository.save(sequence.sequenceTO);
    sequence.sequenceStepCTOs.forEach((step) => {
      if (step.squenceStepTO.sequenceFk === -1) {
        step.squenceStepTO.sequenceFk = sequenceTO.id;
      }
      this.saveSequenceStep(step);
    });
    return createSequenceCTO(sequenceTO);
  },

  saveSequenceStep(sequenceStep: SequenceStepCTO): SequenceStepCTO {
    CheckHelper.nullCheck(sequenceStep, "sequenceStep");
    // TODO: move this in a CheckSaveCondition class.
    if (sequenceStep.squenceStepTO.sequenceFk === -1) {
      throw new Error("Sequence step sequenceFk is '-1'!");
    }
    const persistedActions: ActionTO[] = ActionRepository.findAllForStep(sequenceStep.squenceStepTO.id);
    const actionsToDelete: ActionTO[] = persistedActions.filter(
      (action) => !sequenceStep.actions.some((cDCTO) => cDCTO.actionTO.id === action.id)
    );
    actionsToDelete.map((cptd) => cptd.id).forEach(ActionRepository.delete);

    const savedStep: SequenceStepTO = SequenceStepRepository.save(sequenceStep.squenceStepTO);

    sequenceStep.actions.forEach((action) => {
      action.actionTO.sequenceStepFk = savedStep.id;
      ActionRepository.save(action.actionTO);
    });
    return createSequenceStepCTO(savedStep);
  },

  delete(sequence: SequenceCTO): SequenceCTO {
    CheckHelper.nullCheck(sequence.sequenceTO, "sequenceTO");
    sequence.sequenceStepCTOs.forEach(this.deleteSequenceStep);
    if (sequence.sequenceStepCTOs.length > 0) {
      throw new Error("can not delete sequence, at least one step is containing in this sequence.");
    }
    SequenceRepository.delete(sequence.sequenceTO);
    return sequence;
  },

  deleteSequenceStep(sequenceStep: SequenceStepCTO): SequenceStepCTO {
    CheckHelper.nullCheck(sequenceStep, "step");
    sequenceStep.actions.map((action) => ActionRepository.delete(action.actionTO.id));
    SequenceStepRepository.delete(sequenceStep.squenceStepTO);
    let seqSteps: SequenceStepTO[] = Carv2Util.deepCopy(
      SequenceStepRepository.findAllForSequence(sequenceStep.squenceStepTO.sequenceFk)
    );
    seqSteps.sort((a, b) => a.index - b.index);
    seqSteps.forEach((step, index) => (step.index = index + 1));
    seqSteps.forEach(SequenceStepRepository.save);
    return sequenceStep;
  },
};

const createSequenceCTO = (sequence: SequenceTO | undefined): SequenceCTO => {
  CheckHelper.nullCheck(sequence, "sequence");
  const sequenceStepCTOs: SequenceStepCTO[] = SequenceStepRepository.findAllForSequence(sequence!.id).map(
    createSequenceStepCTO
  );
  sequenceStepCTOs.sort((step1, step2) => step1.squenceStepTO.index - step2.squenceStepTO.index);
  return { sequenceTO: sequence!, sequenceStepCTOs: sequenceStepCTOs };
};

const createSequenceStepCTO = (sequenceStepTO: SequenceStepTO): SequenceStepCTO => {
  CheckHelper.nullCheck(sequenceStepTO, "sequenceStepTO");
  const sourceComponentCTO: ComponentCTO = ComponentDataAccessService.findCTO(sequenceStepTO.sourceComponentFk);
  const targetComponentCTO: ComponentCTO = ComponentDataAccessService.findCTO(sequenceStepTO.targetComponentFk);

  const actionTOs: ActionTO[] = ActionRepository.findAllForStep(sequenceStepTO.id);

  const actionCTOs: ActionCTO[] = actionTOs.map(createActionCTO);

  return {
    componentCTOSource: sourceComponentCTO,
    componentCTOTarget: targetComponentCTO,
    squenceStepTO: sequenceStepTO,
    actions: actionCTOs,
  };
};

const createActionCTO = (actionTO: ActionTO): ActionCTO => {
  CheckHelper.nullCheck(actionTO, "actionTO");
  const component: ComponentTO | undefined = ComponentDataAccessService.find(actionTO.componentFk);
  CheckHelper.nullCheck(component, "component");
  const data: DataTO | undefined = DataDataAccessService.findData(actionTO.dataFk);
  CheckHelper.nullCheck(data, "data");
  return {
    actionTO: actionTO,
    componentTO: component!,
    dataTO: data!,
  };
};
