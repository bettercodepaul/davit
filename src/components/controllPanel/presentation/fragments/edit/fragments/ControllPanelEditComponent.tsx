import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { ComponentCTO } from "../../../../../../dataAccess/access/cto/ComponentCTO";
import { GroupTO } from "../../../../../../dataAccess/access/to/GroupTO";
import { ComponentActions, currentComponent } from "../../../../../../slices/ComponentSlice";
import { GlobalActions, handleError } from "../../../../../../slices/GlobalSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { GroupDropDown } from "../../../../../common/fragments/dropdowns/GroupDropDown";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { Carv2LabelTextfield } from "../common/fragments/Carv2LabelTextfield";
import { Carv2SubmitCancel } from "../common/fragments/Carv2SubmitCancel";
import { OptionField } from "../common/OptionField";

export interface ControllPanelEditComponentProps {}

export const ControllPanelEditComponent: FunctionComponent<ControllPanelEditComponentProps> = (props) => {
  const {
    label,
    name,
    changeName,
    saveComponent,
    deleteComponent,
    cancel,
    toggleIsCreateAnother,
    textInput,
    showDelete,
    validName,
    setGroup,
    compGroup,
  } = useControllPanelEditComponentViewModel();

  return (
    <ControllPanelEditSub label={label}>
      <div className="optionFieldSpacer">
        <OptionField>
          <GroupDropDown onSelect={setGroup} placeholder="Select Group..." value={compGroup} />
        </OptionField>
      </div>
      <div className="columnDivider" style={{ display: "flex" }}>
        <Carv2LabelTextfield
          label="Name:"
          placeholder="Component Name"
          onChange={(event: any) => changeName(event.target.value)}
          value={name}
          autoFocus
          ref={textInput}
        />
      </div>
      <div className="columnDivider" style={{ display: "flex" }}>
        <Carv2SubmitCancel
          onSubmit={saveComponent}
          onCancel={cancel}
          onChange={toggleIsCreateAnother}
          submitCondition={validName()}
        />
      </div>
      {showDelete && (
        <div className="columnDivider">
          <div className="controllPanelEditChild" style={{ display: "flex", alignItems: "center", height: "100%" }}>
            <Carv2DeleteButton onClick={deleteComponent} />
          </div>
        </div>
      )}
    </ControllPanelEditSub>
  );
};

const useControllPanelEditComponentViewModel = () => {
  const componentToEdit: ComponentCTO | null = useSelector(currentComponent);
  const dispatch = useDispatch();
  const [isCreateAnother, setIsCreateAnother] = useState<boolean>(false);
  const textInput = useRef<Input>(null);

  useEffect(() => {
    // check if component to edit is really set or gos back to edit mode
    if (isNullOrUndefined(componentToEdit)) {
      GlobalActions.setModeToEdit();
      handleError("Tried to go to edit component without componentToedit specified");
    }
    // used to focus the textfield on create another
    textInput.current!.focus();
  }, [componentToEdit]);

  const changeName = (name: string) => {
    let copyComponentToEdit: ComponentCTO = Carv2Util.deepCopy(componentToEdit);
    copyComponentToEdit.component.name = name;
    dispatch(ComponentActions.setCompoenentToEdit(copyComponentToEdit));
  };

  const saveComponent = () => {
    dispatch(ComponentActions.saveComponent(componentToEdit!));
    if (isCreateAnother) {
      dispatch(GlobalActions.setModeToEditComponent());
    } else {
      dispatch(GlobalActions.setModeToEdit());
    }
  };

  const deleteComponent = () => {
    dispatch(ComponentActions.deleteComponent(componentToEdit!));
    dispatch(GlobalActions.setModeToEdit());
  };

  const validName = (): boolean => {
    if (!isNullOrUndefined(componentToEdit)) {
      return Carv2Util.isValidName(componentToEdit.component.name);
    }
    return false;
  };

  const setGroup = (group: GroupTO | undefined) => {
    if (!isNullOrUndefined(componentToEdit)) {
      let copyComponentToEdit: ComponentCTO = Carv2Util.deepCopy(componentToEdit);
      if (group !== undefined) {
        copyComponentToEdit.component.groupFks = group.id;
      } else {
        copyComponentToEdit.component.groupFks = -1;
      }
      dispatch(ComponentActions.setCompoenentToEdit(copyComponentToEdit));
    }
  };

  return {
    label: componentToEdit?.component.id === -1 ? "ADD COMPONENT" : "EDIT COMPONENT",
    name: componentToEdit?.component.name,
    changeName,
    saveComponent,
    deleteComponent,
    cancel: () => dispatch(GlobalActions.setModeToEdit()),
    toggleIsCreateAnother: () => setIsCreateAnother(!isCreateAnother),
    textInput,
    showDelete: componentToEdit?.component.id !== -1,
    validName,
    setGroup,
    compGroup: componentToEdit?.component.groupFks !== -1 ? componentToEdit?.component.groupFks : undefined,
  };
};
