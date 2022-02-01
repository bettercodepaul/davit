import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { globalSelectors, globalSlice } from "../../../slices/GlobalSlice";
import { DavitNotification, NotificationLevel } from "./DavitNotification";

export interface ErrorNotificationProps {
}

export const ErrorNotification: FunctionComponent<ErrorNotificationProps> = () => {
        const errorMessages: string[] = useSelector(globalSelectors.selectGlobalErrorState);
        const dispatch = useDispatch();

        const buildMessage = (message: string, index: number): JSX.Element => {
            return <DavitNotification key={index}
                                      header={"Error"}
                                      text={message}
                                      level={NotificationLevel.error}
                                      onCloseCallback={() => dispatch(globalSlice.actions.removeErrorAtIndex(index))}
            />;
        };

        return (
            <>
                {
                    errorMessages.length > 0 &&
                    errorMessages.map((error, index) => buildMessage(error, index))
                }
            </>
        );

    }
;
