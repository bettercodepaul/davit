import React, { FunctionComponent } from "react";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";

export interface ControllPanelEditComponentDataProps {}

export const ControllPanelEditComponentData: FunctionComponent<ControllPanelEditComponentDataProps> = (props) => {
  //   const {
  //     label,
  //     name,
  //     cancel,
  //     addDataToComponent,
  //     deleteDataFromComponent,
  //   } = useControllPanelEditComponentDataViewModel();

  return (
    <ControllPanelEditSub label="Edit Component Data">
      {/* <div />
      <div className="controllPanelEditChild columnDivider">
        <Carv2LabelTextfield label="Component:" value={name} />
      </div>
      <div className="columnDivider controllPanelEditChild">
        <Button.Group>
          {useGetDataDropdown(addDataToComponent, "add")}
          <Button id="buttonGroupLabel" disabled inverted color="orange">
            Data
          </Button>
          {useGetDataDropdown(deleteDataFromComponent, "remove")}
        </Button.Group>
      </div>
      <div className="columnDivider controllPanelEditChild">
        <Button onClick={cancel}>OK</Button>
      </div> */}
    </ControllPanelEditSub>
  );
};

// const useControllPanelEditComponentDataViewModel = () => {
//   const stepToEdit: SequenceStepCTO | null = useSelector(currentStep);
//   const componentToEdit: ComponentCTO | null = useSelector(currentComponent);
//   const dispatch = useDispatch();
//   const [isCreateAnother, setIsCreateAnother] = useState<boolean>(false);

//   useEffect(() => {
//     // check if component to edit is really set or gos back to edit mode
//     if (isNullOrUndefined(componentToEdit)) {
//       GlobalActions.setModeToEdit();
//       handleError("Tried to go to edit component data without componentToedit specified");
//     }
//     // used to focus the textfield on create another
//   }, [componentToEdit]);

//   // const setComponentData = (datas: DataCTO[]) => {
//   //   if (!isNullOrUndefined(componentToEdit) && !isNullOrUndefined(stepToEdit)) {
//   //     const copyStepToEdit: SequenceStepCTO = Carv2Util.deepCopy(stepToEdit);

//   //     const persistentCompDatas = copyStepToEdit.componentDataCTOs.filter(
//   //       (compData) => compData.componentDataTO.id !== -1 && compData.componentTO.id === componentToEdit.component.id
//   //     );
//   //     // filter out all component datas with current component.
//   //     copyStepToEdit.componentDataCTOs = copyStepToEdit.componentDataCTOs.filter(
//   //       (compDat) => compDat.componentTO.id !== componentToEdit.component.id
//   //     );

//   //     // create componentDatas from selected datas.
//   //     const selectedComponentData: ComponentDataCTO[] = datas.map((data) => {
//   //       return new ComponentDataCTO(
//   //         new ComponentDataTO(
//   //           stepToEdit.squenceStepTO.id,
//   //           componentToEdit.component.id,
//   //           data.data.id,
//   //           ComponentDataState.NEW
//   //         ),
//   //         componentToEdit.component,
//   //         data.data
//   //       );
//   //     });
//   //     // // setIds
//   //     selectedComponentData.forEach((compData) => {
//   //       const foundCompData = persistentCompDatas.find((item) => item.dataTO.id === compData.dataTO.id);
//   //       if (foundCompData) {
//   //         compData.componentDataTO.id = foundCompData.componentDataTO.id;
//   //       }
//   //     });

//   //     copyStepToEdit.componentDataCTOs.push(...selectedComponentData);
//   //     // save in state
//   //     dispatch(SequenceActions.updateCurrentSequenceStep(copyStepToEdit));
//   //   }
//   // };

//   const createComponentData = (data: DataCTO | undefined, toDelete: boolean) => {
//     if (!isNullOrUndefined(data) && !isNullOrUndefined(componentToEdit) && !isNullOrUndefined(stepToEdit)) {
//       const copyStepToEdit: SequenceStepCTO = Carv2Util.deepCopy(stepToEdit);
//       const compDataState: ComponentDataState = toDelete ? ComponentDataState.DELETED : ComponentDataState.NEW;
//       const componentData: ComponentDataCTO = new ComponentDataCTO(
//         new ComponentDataTO(stepToEdit.squenceStepTO.id, componentToEdit.component.id, data.data.id, compDataState),
//         Carv2Util.deepCopy(componentToEdit.component),
//         Carv2Util.deepCopy(data.data)
//       );
//       copyStepToEdit.componentDataCTOs.push(componentData);
//       dispatch(SequenceActions.updateCurrentSequenceStep(copyStepToEdit));
//     }
//   };

//   const isComponentData = (componentData: ComponentDataCTO, data: DataCTO, component: ComponentCTO): boolean => {
//     return componentData.componentTO.id === component.component.id && componentData.dataTO.id === data.data.id
//       ? true
//       : false;
//   };

//   const removeComponentData = (data: DataCTO | undefined) => {
//     if (!isNullOrUndefined(data) && !isNullOrUndefined(componentToEdit) && !isNullOrUndefined(stepToEdit)) {
//       const copyStepToEdit: SequenceStepCTO = Carv2Util.deepCopy(stepToEdit);
//       copyStepToEdit.componentDataCTOs = copyStepToEdit.componentDataCTOs.filter(
//         (compData) => !isComponentData(compData, data, componentToEdit)
//       );
//       dispatch(SequenceActions.updateCurrentSequenceStep(copyStepToEdit));
//     }
//   };

//   const addDataToComponent = (data: DataCTO | undefined) => {
//     if (!isNullOrUndefined(data) && !isNullOrUndefined(componentToEdit) && !isNullOrUndefined(stepToEdit)) {
//       if (stepToEdit.componentDataCTOs.find((compData) => isComponentData(compData, data, componentToEdit))) {
//         // check component data status
//         const state: ComponentDataState = stepToEdit.componentDataCTOs.find((compData) =>
//           isComponentData(compData, data, componentToEdit)
//         )!.componentDataTO.componentDataState;
//         if (state === ComponentDataState.DELETED) {
//           removeComponentData(data);
//         } else {
//           console.warn("Component Data already exists!");
//         }
//       } else {
//         createComponentData(data, false);
//       }
//     }
//   };

//   const deleteDataFromComponent = (data: DataCTO | undefined) => {
//     if (!isNullOrUndefined(data) && !isNullOrUndefined(componentToEdit) && !isNullOrUndefined(stepToEdit)) {
//       if (stepToEdit.componentDataCTOs.find((compData) => isComponentData(compData, data, componentToEdit))) {
//         // check component data status
//         const state: ComponentDataState = stepToEdit.componentDataCTOs.find((compData) =>
//           isComponentData(compData, data, componentToEdit)
//         )!.componentDataTO.componentDataState;
//         if (state === ComponentDataState.NEW) {
//           removeComponentData(data);
//           return;
//         }
//         if (state === ComponentDataState.PERSISTENT) {
//           removeComponentData(data);
//           // createComponentData(data, true);
//           return;
//         }
//       }
//       // Return a message if state == DELETE or comp.data dos not exist.
//       console.warn("Component data dos not exist or is already deleted!");
//     }
//   };

//   return {
//     label: componentToEdit?.component.id === -1 ? "ADD COMPONENT DATA" : "EDIT COMPONENT DATA",
//     name: componentToEdit?.component.name,
//     cancel: () => dispatch(GlobalActions.setModeToEditStep(stepToEdit?.squenceStepTO.index)),
//     toggleIsCreateAnother: () => setIsCreateAnother(!isCreateAnother),
//     addDataToComponent,
//     deleteDataFromComponent,
//   };
// };
