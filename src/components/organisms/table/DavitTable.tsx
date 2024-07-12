import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import React, { FunctionComponent } from "react";
import { ElementSize } from "../../../style/Theme";
import { DavitIconButton } from "../../atomic";
import { DavitIcons } from "../../atomic/icons/IconSet";
import "./DavitTable.css";

export interface DavitTableProps {
    header: string[];
    bodyData: DavitTableRowData[];
    addFunction?: () => void;
    tableHeight: number;
}

export interface DavitTableAction {
    callback: () => void;
    icon: IconDefinition;
    disable?: boolean;
}

export interface DavitTableRowData {
    data: (string | JSX.Element)[];
    trClass: string;
    actions: DavitTableAction[];
    onClick?: () => void;
}

export const DavitTable: FunctionComponent<DavitTableProps> = (props) => {
    const {header, bodyData, addFunction, tableHeight} = props;

    const mapValue = (value: string | JSX.Element, index: number) => {
        return (
            <td id={index.toString()}
                key={index}
            >
                {value}
            </td>
        );
    };

    const createButton = (action: DavitTableAction, key: number) => {
        return <DavitIconButton iconName={action.icon}
                                size={ElementSize.small}
                                className={"margin-right-xs"}
                                onClick={action.callback}
                                key={key}
                                disabled={action.disable}
        />;
    };

    const createRow = (data: DavitTableRowData, index: number) => {
        return (
            <tr key={index}
                className={data.trClass}
                onClick={data.onClick}
            >
                {data.data.map(mapValue)}
                {data.actions.length > 0 &&
                <td className={"flex flex-end"}>{data.actions.map((action, index) => createButton(action, index))}</td>}
            </tr>
        );
    };

    const fillWithEmptyRows = () => {
        let filledRows = bodyData.length;
        addFunction && filledRows++;
        const numberOfColumns = bodyData[0]?.data.length || 1;
        const emptyRows = [];
        for (let i = filledRows; i <= 10; i++) {
            emptyRows.push(createEmptyRow(i.toString(), numberOfColumns, "carv2Tr"));
        }
        return emptyRows;
    };

    const createEmptyRow = (key: string, numberOfElements: number, className?: string): JSX.Element => {
        return (
            <tr key={key}
                className={className}
            >
                {new Array(numberOfElements).map((_, index) => {
                    return <td key={index} />;
                })}
            </tr>
        );
    };

    return (
        <table>
            <thead>
            <tr>{header.map(mapValue)}</tr>
            </thead>
            <tbody style={{height: tableHeight}}>
            {bodyData.map(createRow)}
            {addFunction && (
                <tr>
                    <td>{createButton({icon: DavitIcons.plus, callback: addFunction}, 0)}</td>
                </tr>
            )}
            {fillWithEmptyRows()}
            </tbody>
        </table>
    );
};
