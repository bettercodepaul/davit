import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { SequenceConfigurationTO } from "../../../dataAccess/access/to/SequenceConfigurationTO";
import { masterDataSelectors } from "../../../slices/MasterDataSlice";
import { DavitDropDown, DavitDropDownItemProps } from "./DavitDropDown";

interface SequenceConfigurationDropDownProps {
    sequenceId?: number;
    selectedSequenceConfiguration?: number;
    onSelectCallback: (sequenceConfiguration: SequenceConfigurationTO | undefined) => void;
}

export const SequenceConfigurationDropDown: FunctionComponent<SequenceConfigurationDropDownProps> = (props) => {
    const {sequenceId, onSelectCallback, selectedSequenceConfiguration} = props;

    const sequenceConfigurations: SequenceConfigurationTO[] = useSelector(masterDataSelectors.selectSequenceConfigurationsBySequenceId(sequenceId));

    const onSelectSequenceConfiguration = (dropDownItem: DavitDropDownItemProps | undefined) => {
        let selectedSequenceConfiguration: SequenceConfigurationTO | undefined;

        if (dropDownItem !== undefined) {
            selectedSequenceConfiguration = sequenceConfigurations.find(config => config.id === Number(dropDownItem.value));
        }

        onSelectCallback(selectedSequenceConfiguration);
    };

    const buildDropDownItemFromSequenceConfiguration = (sequenceConfiguration: SequenceConfigurationTO): DavitDropDownItemProps => {
        return {
            value: sequenceConfiguration.id.toString(),
            key: sequenceConfiguration.id,
            text: sequenceConfiguration.name
        };
    };

    return (
        <DavitDropDown onSelect={onSelectSequenceConfiguration}
                       dropdownItems={sequenceConfigurations.map(buildDropDownItemFromSequenceConfiguration)}
                       clearable
                       placeholder={sequenceConfigurations.length === 0 ? "No configuration available" : "Select configuration"}
                       value={selectedSequenceConfiguration ? selectedSequenceConfiguration.toString() : undefined}
        />
    );
};

