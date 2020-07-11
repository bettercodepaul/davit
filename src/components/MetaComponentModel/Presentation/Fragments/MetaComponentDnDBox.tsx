import { motion } from "framer-motion";
import React, { useRef } from "react";
import { ComponentCTO } from "../../../../dataAccess/access/cto/ComponentCTO";
import { GroupTO } from "../../../../dataAccess/access/to/GroupTO";
import { Carv2Util } from "../../../../utils/Carv2Util";
import { ViewFragmentProps } from "../../../../viewDataTypes/ViewFragment";
import { createDnDItem } from "../../../common/fragments/DnDWrapper";
import { createCurveArrow } from "../../../common/fragments/svg/Arrow";
import { Arrows } from "../MetaComponentModelController";
import { createMetaComponentFragment } from "./MetaComponentFragment";

interface MetaComponentDnDBox {
  componentCTOs: ComponentCTO[];
  groups: GroupTO[];
  componentCTOToEdit: ComponentCTO | null;
  arrows: Arrows[];
  componentDatas: ViewFragmentProps[];
  onSaveCallBack: (componentCTO: ComponentCTO) => void;
  onClick: (componentId: number) => void;
}

export const MetaComponentDnDBox: React.FunctionComponent<MetaComponentDnDBox> = (props) => {
  const { componentCTOs, onSaveCallBack, arrows, componentCTOToEdit, groups, componentDatas, onClick } = props;
  const constraintsRef = useRef(null);

  const onPositionUpdate = (x: number, y: number, positionId: number) => {
    const componentCTO = componentCTOs.find((componentCTO) => componentCTO.geometricalData.position.id === positionId);
    if (componentCTO) {
      let copyComponentCTO: ComponentCTO = Carv2Util.deepCopy(componentCTO);
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
    let metaComponentFragment = createMetaComponentFragment(
      componentCTO,
      componentDatas.filter((compdata) => compdata.partenId === componentCTO.component.id),
      onClick
    );
    let shadow: string = "";
    if (componentCTO.component.groupFks !== -1) {
      shadow = groups.find((group) => group.id === componentCTO.component.groupFks)?.color || "";
    }
    return createDnDItem(componentCTO.geometricalData, onPositionUpdate, constraintsRef, metaComponentFragment, shadow);
  };

  const findComponentById = (id: number): ComponentCTO | undefined => {
    return componentCTOs.find((comp) => comp.component.id === id);
  };

  return (
    <motion.div id="dndBox" ref={constraintsRef} className="componentModel">
      {componentCTOs.map(createDnDMetaComponentFragmentIfNotInEdit)}
      {componentCTOToEdit && createDnDMetaComponent(componentCTOToEdit)}
      {arrows.map((arrow) => {
        return createCurveArrow(
          findComponentById(arrow.sourceComponentId)?.geometricalData,
          findComponentById(arrow.targetComponentId)?.geometricalData
        );
      })}
    </motion.div>
  );
};
