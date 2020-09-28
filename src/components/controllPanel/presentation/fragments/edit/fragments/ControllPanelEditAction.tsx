import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isNullOrUndefined } from "util";
import { ComponentCTO } from "../../../../../../dataAccess/access/cto/ComponentCTO";
import { SequenceCTO } from "../../../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../../../dataAccess/access/cto/SequenceStepCTO";
import { ActionTO } from "../../../../../../dataAccess/access/to/ActionTO";
import { DataInstanceTO } from "../../../../../../dataAccess/access/to/DataInstanceTO";
import { ActionType } from "../../../../../../dataAccess/access/types/ActionType";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { sequenceModelSelectors } from "../../../../../../slices/SequenceModelSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2ButtonIcon, Carv2ButtonLabel } from "../../../../../common/fragments/buttons/Carv2Button";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ActionTypeDropDown } from "../../../../../common/fragments/dropdowns/ActionTypeDropDown";
import { ComponentDropDown } from "../../../../../common/fragments/dropdowns/ComponentDropDown";
import { InstanceDropDown } from "../../../../../common/fragments/dropdowns/InstanceDropDown";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { OptionField } from "../common/OptionField";

export interface ControllPanelEditActionProps {
  hidden: boolean;
}

export const ControllPanelEditAction: FunctionComponent<ControllPanelEditActionProps> = (props) => {
  const { hidden } = props;
  const {
    label,
    setComponent,
    setAction,
    setData,
    deleteAction,
    componentId,
    dataId,
    actionType,
    setMode,
    createAnother,
    key,
  } = useControllPanelEditActionViewModel();

  return (
    <ControllPanelEditSub label={label} key={key} hidden={hidden} onClickNavItem={setMode}>
      <div className="optionFieldSpacer">
        <OptionField label="Select Component on which the action will be called">
          <ComponentDropDown onSelect={setComponent} value={componentId} />
        </OptionField>
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField label="Select action to execute">
          <ActionTypeDropDown onSelect={setAction} value={actionType} />
        </OptionField>
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField label="Select data affected by the action">
          <InstanceDropDown onSelect={setData} value={dataId} />
        </OptionField>
      </div>

      <div className="columnDivider controllPanelEditChild">
        <div className="innerOptionFieldSpacer">
          <OptionField label="Navigation">
            <Carv2ButtonLabel onClick={createAnother} label="Create another" />
            <Carv2ButtonIcon onClick={setMode} icon="reply" />
          </OptionField>
        </div>
        <OptionField label="Sequence - Options">
          <Carv2DeleteButton onClick={deleteAction} />
        </OptionField>
      </div>
    </ControllPanelEditSub>
  );
};

const useControllPanelEditActionViewModel = () => {
  const actionToEdit: ActionTO | null = useSelector(editSelectors.actionToEdit);
  const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
  const dispatch = useDispatch();

  const [key, setKey] = useState<number>(0);

  useEffect(() => {
    // check if component to edit is really set or gos back to edit mode
    if (isNullOrUndefined(actionToEdit)) {
      dispatch(handleError("Tried to go to edit action without actionToEdit specified"));
      dispatch(EditActions.setMode.edit());
    }
    // used to focus the textfield on create another
  }, [dispatch, actionToEdit]);

  const deleteAction = () => {
    if (!isNullOrUndefined(actionToEdit)) {
      dispatch(EditActions.action.delete(actionToEdit));
      dispatch(EditActions.setMode.editStep(EditActions.step.find(actionToEdit.sequenceStepFk)));
    }
  };

  const setComponent = (component: ComponentCTO | undefined): void => {
    if (!isNullOrUndefined(component)) {
      let copyActionToEdit: ActionTO = Carv2Util.deepCopy(actionToEdit);
      copyActionToEdit.componentFk = component.component.id;
      dispatch(EditActions.action.update(copyActionToEdit));
      dispatch(EditActions.action.save(copyActionToEdit));
    }
  };

  const setAction = (actionType: ActionType | undefined): void => {
    if (!isNullOrUndefined(actionType) && !isNullOrUndefined(selectedSequence) && !isNullOrUndefined(actionToEdit)) {
      let copyActionToEdit: ActionTO = Carv2Util.deepCopy(actionToEdit);
      copyActionToEdit.actionType = actionType;
      copyActionToEdit.sendingComponentFk = actionType.includes("SEND")
        ? getSendingComponendId(actionToEdit.sequenceStepFk)
        : -1;
      dispatch(EditActions.action.update(copyActionToEdit));
      dispatch(EditActions.action.save(copyActionToEdit));
    }
  };

  const getSendingComponendId = (stepId: number): number => {
    let sendingComponendId: number = -1;
    if (selectedSequence !== null && actionToEdit !== null) {
      const step: SequenceStepCTO | undefined = selectedSequence.sequenceStepCTOs.find(
        (step) => step.squenceStepTO.id === actionToEdit.sequenceStepFk
      );
      if (step) {
        sendingComponendId = step.squenceStepTO.sourceComponentFk;
      }
    }
    return sendingComponendId;
  };

  const setData = (instance: DataInstanceTO | undefined): void => {
    if (instance !== null) {
      let copyActionToEdit: ActionTO = Carv2Util.deepCopy(actionToEdit);
      // TODO: add to select a instace as well.
      copyActionToEdit.dataFk = instance ? instance.dataFk : -1;
      dispatch(EditActions.action.update(copyActionToEdit));
      dispatch(EditActions.action.save(copyActionToEdit));
    }
  };

  const setMode = (newMode?: string) => {
    if (!isNullOrUndefined(actionToEdit)) {
      if (newMode && newMode === "EDIT") {
        dispatch(EditActions.setMode.edit());
      } else if (newMode && newMode === "SEQUENCE") {
        dispatch(EditActions.setMode.editSequence(selectedSequence?.sequenceTO.id));
      } else {
        dispatch(EditActions.setMode.editStep(EditActions.step.find(actionToEdit.sequenceStepFk)));
      }
    }
  };

  const createAnother = () => {
    if (actionToEdit) {
      let newAction: ActionTO = new ActionTO();
      newAction.sequenceStepFk = actionToEdit.sequenceStepFk;
      dispatch(EditActions.action.create(newAction));
      setKey(key + 1);
    }
  };

  return {
    label: "EDIT * SEQUENCE * STEP * ACTION",
    action: actionToEdit,
    setComponent,
    setAction,
    setData,
    componentId: actionToEdit?.componentFk === -1 ? undefined : actionToEdit?.componentFk,
    dataId: actionToEdit?.dataFk === -1 ? undefined : actionToEdit?.dataFk,
    actionType: actionToEdit?.actionType,
    deleteAction,
    setMode,
    createAnother,
    key,
  };
};
