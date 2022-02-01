import { motion, Point } from "framer-motion";
import React, { FunctionComponent } from "react";
import { GeometricalDataCTO } from "../../../dataAccess/access/cto/GeometraicalDataCTO";
import { Direction } from "../../../dataAccess/access/to/DataRelationTO";
import "./DavitPath.css";

export interface Arrow {
    sourceGeometricalData: GeometricalDataCTO;
    targetGeometricalData: GeometricalDataCTO;
    dataLabels: string[];
    type: ArrowType;
}

export enum ArrowType {
    SEND = "SEND",
    TRIGGER = "TRIGGER",
}

export enum DavitPathTypes {
    SMOOTH = "SMOOTH",
    GRID = "GRID",
}

export enum DavitPathHead {
    ARROW = "ARROW",
}

export interface DavitPathProps {
    xSource: number;
    ySource: number;
    xTarget: number;
    yTarget: number;
    sourceHeight: number;
    sourceWidth: number;
    targetHeight: number;
    targetWidth: number;
    id: number;
    labels: string[];
    lineType: DavitPathTypes;
    head?: DavitPathHead;
    sourceDirection?: Direction;
    targetDirection?: Direction;
    stroked?: boolean;
    lineColor?: string;
    key?: any;
}

export const DavitPath: FunctionComponent<DavitPathProps> = (props) => {
    const {
        xSource,
        ySource,
        xTarget,
        yTarget,
        sourceWidth,
        sourceHeight,
        targetHeight,
        targetWidth,
        id,
        labels,
        sourceDirection,
        targetDirection,
        stroked,
        head,
        lineType,
        lineColor,
    } = props;

    const INTERFACE_INPUT: Point = {x: 0, y: targetHeight / 2};
    const INTERFACE_OUTPUT: Point = {x: 0, y: sourceHeight / 2};
    const OFFSET: number = 10;
    const MARKER_WIDTH: number = 20;
    const TEXT_OFFSET: number = 25;

    const createSmoothLine = (x1: number, y1: number, x2: number, y2: number) => {
        const startDir: "LEFT" | " RIGHT" = x2 < x1 + sourceWidth / 2 ? "LEFT" : " RIGHT";
        const endDir: "LEFT" | " RIGHT" = x1 < x2 + sourceWidth / 2 ? "LEFT" : " RIGHT";
        const xStart = startDir === "LEFT" ? x1 : x1 + sourceWidth;
        const xEnd = endDir === "LEFT" ? x2 : x2 + targetWidth + OFFSET + MARKER_WIDTH;
        let startPoint: Point = {x: xStart, y: y1};
        let endPoint: Point = {x: xEnd, y: y2};
        // set interfaces
        startPoint = plusPoint(startPoint, INTERFACE_OUTPUT);
        endPoint = plusPoint(endPoint, INTERFACE_INPUT);
        // add object offset
        const offsetStartPoint = setOutPutOffset(startPoint, OFFSET, startDir);
        endPoint = setInputPutOffset(endPoint, OFFSET);

        const middlePoint = getMiddlePoint(offsetStartPoint, endPoint);
        const curveRefPoint = getCurvRefPoint(offsetStartPoint, middlePoint);
        const offsetStartSign = startDir === "LEFT" ? "-" : "";
        const offsetEndSign = endDir === "LEFT" ? "" : "-";

        return (
            <>
                <path
                    d={`M ${startPoint.x},${startPoint.y} 
        l ${offsetStartSign}10,0
        Q ${curveRefPoint.x}, 
        ${curveRefPoint.y} 
        ${middlePoint.x}, 
        ${middlePoint.y}
        T ${endPoint.x}, ${endPoint.y}
        l ${offsetEndSign}10,0
        `}
                    className={"carvPath "}
                    markerEnd="url(#arrow)"
                    style={{stroke: lineColor ? lineColor : "black", strokeDasharray: stroked ? 5.5 : ""}}
                />
                {labels.map((label, index) => {
                    return (
                        <>
                            <text
                                x={middlePoint.x - TEXT_OFFSET}
                                y={middlePoint.y + index * 20}
                                className="davitArrowTextBG"
                            >
                                {label}
                            </text>
                            <text
                                x={middlePoint.x - TEXT_OFFSET}
                                y={middlePoint.y + index * 20}
                                className="davitArrowText"
                            >
                                {label}
                            </text>
                        </>
                    );
                })}
            </>
        );
    };

    const createGridLine = () => {
        const startPoint: Point = getDirectionPoint(
            {x: xSource, y: ySource},
            sourceWidth,
            sourceHeight,
            sourceDirection,
        );
        const endPoint: Point = getDirectionPoint(
            {x: xTarget, y: yTarget},
            targetWidth,
            targetHeight,
            targetDirection,
        );

        // set interfaces
        const offset1 = getDirectionOffset(sourceDirection);
        const offset2 = getDirectionOffset(targetDirection);

        const offsetPoint1 = plusPoint(startPoint, offset1);
        const offsetPoint2 = plusPoint(endPoint, offset2);

        return (
            <path
                d={`M ${startPoint.x},${startPoint.y} 
        L ${offsetPoint1.x},${offsetPoint1.y}
        L ${offsetPoint2.x},${offsetPoint2.y}
        L ${endPoint.x},${endPoint.y}
        `}
                style={{
                    strokeDasharray: stroked ? "5,5" : 0,
                    strokeWidth: "2px",
                    fill: "transparent",
                    stroke: "black",
                }}
                id={id.toString()}
            />
        );
    };

    const getDirectionOffset = (direction?: Direction): Point => {
        const offset = 25;
        switch (direction) {
            case Direction.TOP:
                return {x: 0, y: -offset};
            case Direction.LEFT:
                return {x: -offset, y: 0};
            case Direction.RIGHT:
                return {x: offset, y: 0};
            case Direction.BOTTOM:
                return {x: 0, y: offset};
            case undefined:
                return {x: 0, y: 0};
        }
    };

    const getDirectionPoint = (point: Point, width: number, height: number, direction?: Direction): Point => {
        switch (direction) {
            case Direction.TOP:
                point.x = point.x + width / 2;
                break;
            case Direction.LEFT:
                point.y = point.y + height / 2;
                break;
            case Direction.RIGHT:
                point.x = point.x + width;
                point.y = point.y + height / 2;
                break;
            case Direction.BOTTOM:
                point.x = point.x + width / 2;
                point.y = point.y + height;
                break;
        }
        return point;
    };

    const getMiddleValue = (val1: number, val2: number): number => {
        return (val2 - val1) / 2 + val1;
    };

    const setOutPutOffset = (point: Point, offset: number, startDir: "LEFT" | " RIGHT"): Point => {
        return startDir === "LEFT" ? {x: point.x - offset, y: point.y} : {x: point.x + offset, y: point.y};
    };

    const setInputPutOffset = (point: Point, offset: number): Point => {
        return {x: point.x - offset, y: point.y};
    };

    const plusPoint = (point1: Point, point2: Point): Point => {
        return {x: point1.x + point2.x, y: point1.y + point2.y};
    };

    const getMiddlePoint = (startPoint: Point, endPoint: Point): Point => {
        return {
            x: getMiddleValue(startPoint.x, endPoint.x),
            y: getMiddleValue(startPoint.y, endPoint.y),
        };
    };

    const getCurvRefPoint = (curveStartPoint: Point, curveEndPoint: Point): Point => {
        return {
            x: getMiddleValue(curveStartPoint.x, curveEndPoint.x),
            y: curveStartPoint.y,
        };
    };

    const createPath = (type: DavitPathTypes) => {
        switch (type) {
            case DavitPathTypes.SMOOTH:
                return createSmoothLine(xSource, ySource, xTarget, yTarget);
            case DavitPathTypes.GRID:
                return createGridLine();
        }
    };

    return (
        <motion.svg className="componentSVGArea">
            {head === DavitPathHead.ARROW && (
                <defs>
                    <marker
                        id="arrow"
                        markerWidth="10"
                        markerHeight="10"
                        refX="8"
                        refY="3"
                        orient="auto"
                        strokeWidth="0"
                    >
                        <path d="M0,0 L0,6 L9,3 z"
                              className="carvArrowMarker"
                        />
                    </marker>
                </defs>
            )}
            {createPath(lineType)}
        </motion.svg>
    );
};
