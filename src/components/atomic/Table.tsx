import React, { FunctionComponent } from "react";
import "./Table.css";

export interface TableRow {
    cellElements: JSX.Element[];
}

export interface TableProps {
    headers?: JSX.Element[];
    tableRows?: TableRow[];
}

export const Table: FunctionComponent<TableProps> = (props) => {
    const {headers, tableRows} = props;

    const buildHeader = (header: JSX.Element, index: number): JSX.Element => {
        return <th key={index}><div className="flex flex-center align-center width-fluid height-fluid">{header}</div></th>;
    };

    const buildCell = (jsx: JSX.Element, index: number): JSX.Element => {
        return <td key={index}>{jsx}</td>;
    };

    const buildTableRow = (row: TableRow, index: number): JSX.Element => {
        return (
            <tr key={index}>
                {row.cellElements.map(buildCell)}
            </tr>
        );
    };

    return (
        <table className="width-fluid">
            {headers && <thead className="thaeder">
            <tr>
                {headers.map(buildHeader)}
            </tr>
            </thead>}

            {tableRows !== undefined && tableRows.length > 0 && <tbody>
            {tableRows.map(buildTableRow)}
            </tbody>}

        </table>
    );
};
