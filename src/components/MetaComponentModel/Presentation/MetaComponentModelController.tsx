import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "semantic-ui-react";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { selectStep } from "../../common/viewModel/GlobalSlice";
import { MetaComponentActions } from "../viewModel/MetaComponentActions";
import { selectComponents } from "../viewModel/MetaComponentModelSlice";
import { MetaComponentDnDBox } from "./fragments/MetaComponentDnDBox";

interface MetaComponentModelControllerProps {}

export const MetaComponentModelController: FunctionComponent<MetaComponentModelControllerProps> = () => {
  const components: ComponentCTO[] = useSelector(selectComponents);
  const selectedStep: SequenceStepCTO | undefined = useSelector(selectStep);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(MetaComponentActions.findAllComponents());
  }, [dispatch]);

  const createNewComponent = () => {
    dispatch(MetaComponentActions.saveComponent(new ComponentCTO()));
  };

  const saveComp = (componentCTO: ComponentCTO) => {
    dispatch(MetaComponentActions.saveComponent(componentCTO));
  };

  const deleteComp = (id: number) => {
    const componentToDelete: ComponentCTO | undefined = components.find(
      (component) => component.component.id === id
    );
    if (componentToDelete) {
      dispatch(MetaComponentActions.deleteComponent(componentToDelete));
    }
  };

  const createMetaComponentDnDBox = () => {
    return (
      <MetaComponentDnDBox
        componentCTOs={components}
        onSaveCallBack={saveComp}
        onDeleteCallBack={deleteComp}
        step={selectedStep}
      />
    );
  };

  return (
    <div>
      <Button icon="add" onClick={createNewComponent} />
      {createMetaComponentDnDBox()}
    </div>
  );
};
