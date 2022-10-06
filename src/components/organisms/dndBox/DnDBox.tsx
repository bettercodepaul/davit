import { motion } from "framer-motion";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { GeometricalDataTO } from "../../../dataAccess/access/to/GeometricalDataTO";
import { PositionTO } from "../../../dataAccess/access/to/PositionTO";
import { ASPECT_RATIO, WINDOW_FACTOR } from "../../../DavitConstants";
import { useCurrentHeight, useCurrentWitdh, useCustomZoomEvent } from "../../../utils/WindowUtil";
import { DavitPath, DavitPathProps } from "../../atomic/svg/DavitPath";
import { createDnDItem } from "./fragments/DnDWrapper";

export interface DnDBoxElement {
    element: JSX.Element;
    position: PositionTO;
    geometricalData?: GeometricalDataTO;
}

export interface DnDBox {
    toDnDElements: DnDBoxElement[];
    svgElements: DavitPathProps[];
    fullScreen?: boolean;
    onPositionUpdate: (x: number, y: number, positionId: number) => void;
    onGeoUpdate?: (width: number, height: number, geoId: number) => void;
    zoomIn: () => void;
    zoomOut: () => void;
    zoom?: number;
    type: DnDBoxType;
}

export enum DnDBoxType {
    actor = "actorModel",
    data = "dataModel",
    fullscreen = "fullscreen"
}

export const DnDBox: FunctionComponent<DnDBox> = (props) => {
    const {
        fullScreen,
        toDnDElements,
        onPositionUpdate,
        zoomIn,
        zoomOut,
        zoom,
        type,
        svgElements,
        onGeoUpdate,
    } = props;

    const {key, constraintsRef, height, width, paths} = useDnDBoxViewModel(svgElements);

    const [mouseOver, setMouseOver] = useState<boolean>(false);

    useCustomZoomEvent({zoomInCallBack: zoomIn, zoomOutCallBack: zoomOut}, mouseOver);

    const createDavitPath = (paths: DavitPathProps[]): JSX.Element[] => {
        return paths.map((svg, index) => {
            return <DavitPath {...svg} key={index} />;
        });
    };

    const wrapItem = (toDnDElement: DnDBoxElement): JSX.Element => {
        return createDnDItem(
            toDnDElement.position,
            onPositionUpdate,
            constraintsRef,
            toDnDElement.element,
            undefined,
            toDnDElement.geometricalData?.id || undefined,
            onGeoUpdate,
        );
    };

    return (
        <motion.div
            onMouseEnter={() => setMouseOver(true)}
            onMouseLeave={() => setMouseOver(false)}
            ref={constraintsRef}
            style={fullScreen ? {height: height, maxWidth: width} : {}}
            className={fullScreen ? type.toString() + "Fullscreen" : type.toString()}
            key={key}
        >
            {toDnDElements.map(wrapItem)}
            <motion.label className="zoomLabel"
                          key={zoom ? zoom : ""}
            >
                {zoom ? Math.round(zoom * 100) + "%" : ""}
            </motion.label>
            <motion.svg className="sVGArea">{createDavitPath(paths)}</motion.svg>
        </motion.div>
    );
};

const useDnDBoxViewModel = (svgElements: DavitPathProps[]) => {
    const [key, setKey] = useState<number>(0);
    const constraintsRef = useRef<HTMLInputElement>(null);

    const [paths, setPaths] = useState<DavitPathProps[]>([]);

    const currentWindowWitdh: number = useCurrentWitdh();
    const currentWindowHeight: number = useCurrentHeight();
    const newWindowHeight: number = (currentWindowWitdh / WINDOW_FACTOR) * ASPECT_RATIO;
    const newWindowWitdh: number = (currentWindowHeight / ASPECT_RATIO) * WINDOW_FACTOR;

    useEffect(() => {
        const handleResize = () => setKey((prevState) => prevState + 1);
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (constraintsRef !== null && constraintsRef.current !== null) {
            const newPaths: DavitPathProps[] = [];
            svgElements.forEach((svg) => {
                const updatedSvg: DavitPathProps = svg;
                updatedSvg.xSource = svg.xSource * (constraintsRef.current!.offsetWidth / 100);
                updatedSvg.ySource = svg.ySource * (constraintsRef.current!.offsetHeight / 100);
                updatedSvg.xTarget = svg.xTarget * (constraintsRef.current!.offsetWidth / 100);
                updatedSvg.yTarget = svg.yTarget * (constraintsRef.current!.offsetHeight / 100);
                newPaths.push(updatedSvg);
            });
            setPaths(newPaths);
        }
    }, [constraintsRef, svgElements]);

    return {
        constraintsRef,
        height: newWindowHeight,
        width: newWindowWitdh,
        key,
        paths,
    };
};
