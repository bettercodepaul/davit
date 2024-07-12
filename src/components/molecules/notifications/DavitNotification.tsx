import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FunctionComponent } from "react";
import { DavitIcons } from "../../atomic/icons/IconSet";
import "./DavitNotification.css";

export enum NotificationLevel {
    info = "info",
    warning = "warning",
    error = "error"
}

export interface DavitNotificationProps {
    header: string;
    text: string;
    level: NotificationLevel;
    onCloseCallback: () => void;
}

export const DavitNotification: FunctionComponent<DavitNotificationProps> = (props) => {
    const {header, text, level, onCloseCallback} = props;

    const getNotificationIcon = (): IconDefinition => {
        switch (level) {
            case "info":
                return DavitIcons.info;
            case "warning":
                return DavitIcons.warning;
            case "error":
                return DavitIcons.error;
            default:
                return faInfoCircle;
        }
    };

    return (
        <div className={"notificationCard " + level}
        >
            <button className={level + " margin-medium"}
                    onClick={() => onCloseCallback()}
            >
                <FontAwesomeIcon icon={getNotificationIcon()}
                                 size={"2x"}
                                 className={level}
                />
            </button>
            <div>
                <h3 className={level}>{header}</h3>
                <label>{text}</label>
            </div>
        </div>
    );
};
