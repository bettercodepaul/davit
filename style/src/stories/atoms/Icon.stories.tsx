import { Meta, Story } from "@storybook/react";
import React from "react";
import { withDesign } from "storybook-addon-designs";

import { availableIcons, Icon, IconActorEdit, IconProps } from "../../components/atomic/icons";
import { backgrounds } from "../shared/styles";

const iconList = Array.from(Object.keys(availableIcons)).sort();

export default {
    title: "Atoms/Icon",
    component: Icon,
    parameters: {
        backgrounds: backgrounds
    },
    argTypes: {
        name: {
            control: {
                type: "select",
                options: iconList
            }
        },
        color: {control: "color", name: "color"},
    },
    decorators: [withDesign],
} as Meta;

const figmaDesign = {
    design: {
        type: "figma",
        url:
            "https://www.figma.com/file/luhWDiOZmB1SGIOpp5S051/DAVIT-Design-System?node-id=10%3A5",
    },
    controls: {hideNoControlsWarning: false},
};

const Template: Story<IconProps> = (args) => <Icon {...args} />;


export const BasicIcon = Template.bind({});
BasicIcon.parameters = figmaDesign;
BasicIcon.args = {
    name: "actor-search",
    size: "3em"
};

const SpecificIconTemplate: Story<IconProps> = (args) => <IconActorEdit {...args} />;
export const SingleIcon = SpecificIconTemplate.bind({});
SingleIcon.parameters = figmaDesign;
SingleIcon.args = {
    size: "3em"
};

// @ts-ignore
// @ts-ignore
export const IconOverview = () => (
    <>
        There are {iconList.length} icons
        <div style={{display: "flex", flexWrap: "wrap"}}>
            {iconList.map((key) => (
                <div key={key}
                     style={{
                         width: "70px",
                         display: "flex",
                         flexDirection: "column",
                         alignItems: "center",
                         padding: "10px"
                     }}
                >
          <span style={{fontSize: "30px"}}>
            <Icon name={key as keyof typeof availableIcons} />
          </span>
                    <span>{key}</span>
                </div>
            ))}
        </div>
    </>
);
IconOverview.parameters = {
    ...figmaDesign
};


export const IconExamples = () => (
    <>
        <table style={{width: "100%"}}>
            <thead>
            <tr>
                <th style={{width: "50%", textAlign: "left"}}>Beschreibung</th>
                <th style={{width: "50%", textAlign: "left"}}>Icon</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>
                    size={"20px"}
                </td>
                <td>
                    <Icon name={"actor-add"}
                          size={"20px"}
                    />
                </td>
            </tr>
            <tr>
                <td>
                    size={"10%"}
                </td>
                <td>
                    <Icon name={"actor-add"}
                          size={"10%"}
                    />
                </td>
            </tr>
            <tr>
                <td>
                    Inherit color from parent
                </td>
                <td style={{fontSize: "3em", color: "orange"}}>
                    <Icon name={"actor-add"} />
                </td>
            </tr>
            <tr>
                <td>
                    color={"red"}
                </td>
                <td style={{fontSize: "3em"}}>
                    <Icon name={"actor-add"}
                          color={"red"}
                    />
                </td>
            </tr>
            <tr>
                <td>
                    color={"#00FF00"}
                </td>
                <td style={{fontSize: "3em"}}>
                    <Icon name={"actor-add"}
                          color={"#00FF00"}
                    />
                </td>
            </tr>
            <tr>
                <td>
                    color={"rgba(0,0,255, .5)"}
                </td>
                <td style={{fontSize: "3em"}}>
                    <Icon name={"actor-add"}
                          color={"rgba(0,0,255, .5)"}
                    />
                </td>
            </tr>
            <tr>
                <td>
                    Inline
                </td>
                <td style={{fontSize: "2em"}}>
                    Inline <Icon name={"actor-add"} /> example
                </td>
            </tr>
            <tr>
                <td>
                    verticalOffset={20}
                </td>
                <td style={{fontSize: "2em"}}>
                    Inline <Icon name={"actor-add"}
                                 verticalOffset={20}
                /> example
                </td>
            </tr>
            <tr>
                <td>
                    {"style=\"rotate: \"45deg\", border: \"3px dashed red\""}
                </td>
                <td style={{fontSize: "2em"}}>
                    <Icon name={"actor-add"}
                          style={{rotate: "45deg", border: "3px dashed red"}}
                    />
                </td>
            </tr>
            </tbody>
        </table>
    </>
);
IconOverview.parameters = {
    ...figmaDesign
};
