import React, { FunctionComponent, Ref, useEffect, useRef, useState } from "react";
import "./DavitTextInput.css";

export interface DavitTextInputProps {
    onChangeCallback: (value: string) => void;
    focus?: boolean;
    onBlur?: () => void;
    placeholder?: string;
    value?: string;
    label?: string;
}

export const DavitTextInput: FunctionComponent<DavitTextInputProps> = (props) => {
    const {label, placeholder, value, onChangeCallback, onBlur, focus} = props;

    const [stateValue, setStateValue] = useState<string>("");

    useEffect(() => {
        setStateValue(value ? value : "");
    }, [value]);

    const inputRef: Ref<HTMLInputElement> = useRef<HTMLInputElement>(null);

    // focus on input field on render.
    useEffect(() => {
        if (inputRef !== null && inputRef.current !== null && focus) {
            inputRef.current.focus();
        }
    }, [focus, inputRef]);

    return (
        <div className="flex">
            {label && <label className={"inputLabel flex flex-center padding-small"}>{label}</label>}
            <input
                className={label ? "input label padding-small" : "padding-small"}
                type={"text"}
                placeholder={placeholder}
                value={stateValue}
                ref={inputRef}
                onChange={(event) => {
                    setStateValue(event.target.value);
                    onChangeCallback(event.target.value);
                }}
                onBlur={onBlur}
            />
        </div>
    );
};
