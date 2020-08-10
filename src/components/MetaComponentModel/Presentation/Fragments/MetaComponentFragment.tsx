import React, { FunctionComponent } from "react";
import { Card } from "semantic-ui-react";
import { ComponentCTO } from "../../../../dataAccess/access/cto/ComponentCTO";
import { createViewFragment, ViewFragmentProps } from "../../../../viewDataTypes/ViewFragment";

export interface MetaComponentFragmentProps {
  id: number;
  initName: string;
  initColor: string;
  initWidth?: number;
  initHeigth?: number;
  dataFragments: ViewFragmentProps[];
  onClick?: (id: number) => void;
}

export const MetaComponentFragment: FunctionComponent<MetaComponentFragmentProps> = (props) => {
  const { initName, dataFragments, initWidth, initHeigth } = props;

  return (
    <Card
      raised
      style={{ width: initalWidth, height: initalHeigth, fontSize: "0.7em" }}
      onClick={props.onClick ? () => props.onClick!(props.id) : undefined}
    >
      <Card.Content header={initName}></Card.Content>
      {dataFragments.map(createViewFragment)}
    </Card>
  );
};

export const createMetaComponentFragment = (
  componentCTO: ComponentCTO,
  componentDatas: ViewFragmentProps[],
  onClick?: (id: number) => void
) => {
  return (
    <MetaComponentFragment
      id={componentCTO.component.id}
      initalName={componentCTO.component.name}
      initalColor={componentCTO.design.color}
      initalWidth={componentCTO.geometricalData.geometricalData.width}
      initalHeigth={componentCTO.geometricalData.geometricalData.height}
      dataFragments={componentDatas}
      // onClick={onClick}
    />
  );
};
