import { motion } from "framer-motion";
import React, { FunctionComponent, useRef } from "react";
import { ActionCTO } from "../../../../dataAccess/access/cto/ActionCTO";
import { ComponentCTO } from "../../../../dataAccess/access/cto/ComponentCTO";
import { ComponentDataCTO } from "../../../../dataAccess/access/cto/ComponentDataCTO";
import { SequenceStepCTO } from "../../../../dataAccess/access/cto/SequenceStepCTO";
import { GroupTO } from "../../../../dataAccess/access/to/GroupTO";
import { createDnDItem } from "../../../common/fragments/DnDWrapper";
import { createCurveArrow } from "../../../common/fragments/svg/Arrow";
import { createMetaComponentFragment } from "./MetaComponentFragment";

interface MetaComponentDnDBox {
  componentCTOs: ComponentCTO[];
  groups: GroupTO[];
  componentCTOToEdit: ComponentCTO | null;
  step: SequenceStepCTO | null;
  componentDatas: (ComponentDataCTO | ActionCTO)[];
  onSaveCallBack: (componentCTO: ComponentCTO) => void;
}

export const MetaComponentDnDBox: FunctionComponent<MetaComponentDnDBox> = (props) => {
  const { componentCTOs, onSaveCallBack, step, componentCTOToEdit, groups, componentDatas } = props;

  const constraintsRef = useRef(null);

  const onPositionUpdate = (x: number, y: number, positionId: number) => {
    const componentCTO = componentCTOs.find((componentCTO) => componentCTO.geometricalData.position.id === positionId);
    if (componentCTO) {
      let copyComponentCTO: ComponentCTO = JSON.parse(JSON.stringify(componentCTO));
      copyComponentCTO.geometricalData.position.x = x;
      copyComponentCTO.geometricalData.position.y = y;
      onSaveCallBack(copyComponentCTO);
    }
  };

  const createDnDMetaComponentFragmentIfNotInEdit = (componentCTO: ComponentCTO) => {
    if (!(componentCTOToEdit && componentCTOToEdit.component.id === componentCTO.component.id)) {
      return createDnDMetaComponent(componentCTO);
    }
  };

  const createDnDMetaComponent = (componentCTO: ComponentCTO) => {
    let metaComponentFragment = createMetaComponentFragment(componentCTO, componentDatas);
    let shadow: string = "";
    if (componentCTO.component.groupFks !== -1) {
      shadow = groups.find((group) => group.id === componentCTO.component.groupFks)?.color || "";
    }
    return createDnDItem(componentCTO.geometricalData, onPositionUpdate, constraintsRef, metaComponentFragment, shadow);
  };

  return (
    <motion.div id="dndBox" ref={constraintsRef} className="componentModel">
      {componentCTOs.map(createDnDMetaComponentFragmentIfNotInEdit)}
      {componentCTOToEdit && createDnDMetaComponent(componentCTOToEdit)}
      {step &&
        createCurveArrow(
          componentCTOs.find((componentCTO) => componentCTO.component.id === step.componentCTOSource.component.id)
            ?.geometricalData,
          componentCTOs.find((componentCTO) => componentCTO.component.id === step.componentCTOTarget.component.id)
            ?.geometricalData
        )}
    </motion.div>
  );
};
