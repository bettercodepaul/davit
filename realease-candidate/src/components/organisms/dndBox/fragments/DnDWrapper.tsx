import { motion, useInvertedScale, useMotionValue } from "framer-motion";
import React, { FunctionComponent, useEffect, useRef } from "react";
import { PositionTO } from "../../../../dataAccess/access/to/PositionTO";
import { WINDOW_FACTOR } from "../../../../DavitConstants";

export interface DnDWrapperProps {
    dragConstraintsRef: any;
    positionId: number;
    initX: number;
    initY: number;
    onPositionUpdate: (x: number, y: number, positionId: number) => void;
    shadow?: string;
    onGeoUpdate?: (width: number, height: number, geoId: number) => void;
    geoId?: number;
}

export const DnDWrapper: FunctionComponent<DnDWrapperProps> = (props) => {
    const {dragConstraintsRef, initX, initY, onPositionUpdate, positionId, shadow, onGeoUpdate, geoId} = props;

    const x = useMotionValue(initX);
    const y = useMotionValue(initY);
    const {scaleX, scaleY} = useInvertedScale();

    useEffect(() => {
        x.set(initX * (dragConstraintsRef.current.offsetWidth / 100));
        y.set(initY * (dragConstraintsRef.current.offsetHeight / 100));
    }, [x, initX, y, initY, dragConstraintsRef]);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref && ref.current && onGeoUpdate && geoId) {
            onGeoUpdate(ref.current.getBoundingClientRect().width, ref.current.getBoundingClientRect().height, geoId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref?.current?.getBoundingClientRect().width, ref?.current?.getBoundingClientRect().height]);

    return (
        <motion.div
            drag={true}
            dragConstraints={dragConstraintsRef}
            dragMomentum={false}
            dragElastic={0}
            onDragEnd={(event, info) => {
                onPositionUpdate(
                    /*
          keine Nachkommastellen
          Positioniert das DnD Element entsprechend der Fenster größe.
          */
                    Number(info.point.x.toFixed(0)) / (dragConstraintsRef.current.offsetWidth / WINDOW_FACTOR),
                    Number(info.point.y.toFixed(0)) / (dragConstraintsRef.current.offsetHeight / WINDOW_FACTOR),
                    positionId,
                );
            }}
            className="dndWrapper"
            style={{
                boxShadow: shadow ? "3px 3px 3px " + shadow : "",
                x,
                y,
                scaleX,
                scaleY,
            }}
            ref={ref}
        >
            {props.children}
        </motion.div>
    );
};

export const createDnDItem = (
    position: PositionTO,
    onPositionUpdateCallBack: (x: number, y: number, positionId: number) => void,
    dragConstraintsRef: any,
    children: React.ReactNode,
    shadow?: string,
    geoId?: number,
    updateGeo?: (width: number, heigth: number, geoId: number) => void,
) => {
    return (
        <DnDWrapper
            key={position.id}
            onPositionUpdate={onPositionUpdateCallBack}
            positionId={position.id}
            initX={position.x}
            initY={position.y}
            dragConstraintsRef={dragConstraintsRef}
            shadow={shadow}
            onGeoUpdate={updateGeo}
            geoId={geoId}
        >
            {children}
        </DnDWrapper>
    );
};
