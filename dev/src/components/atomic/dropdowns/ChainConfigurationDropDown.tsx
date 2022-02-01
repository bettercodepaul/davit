import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { ChainConfigurationTO } from "../../../dataAccess/access/to/ChainConfigurationTO";
import { masterDataSelectors } from "../../../slices/MasterDataSlice";
import { DavitDropDown, DavitDropDownItemProps } from "./DavitDropDown";

interface ChainConfigurationDropDownProps {
    chainId?: number;
    selectedChainConfiguration?: number;
    onSelectCallback: (chainConfiguration: ChainConfigurationTO | undefined) => void;
}

export const ChainConfigurationDropDown: FunctionComponent<ChainConfigurationDropDownProps> = (props) => {
    const {chainId, onSelectCallback, selectedChainConfiguration} = props;

    const chainConfigurations: ChainConfigurationTO[] = useSelector(masterDataSelectors.selectChainConfigurationsByChainId(chainId));

    const onSelectChainConfiguration = (dropDownItem: DavitDropDownItemProps | undefined) => {
        let selectedChainConfiguration: ChainConfigurationTO | undefined;

        if (dropDownItem !== undefined) {
            selectedChainConfiguration = chainConfigurations.find(config => config.id === Number(dropDownItem.value));
        }

        onSelectCallback(selectedChainConfiguration);
    };

    const buildDropDownItemFromSequenceConfiguration = (chainConfiguration: ChainConfigurationTO): DavitDropDownItemProps => {
        return {
            value: chainConfiguration.id.toString(),
            key: chainConfiguration.id,
            text: chainConfiguration.name
        };
    };

    return (
        <DavitDropDown onSelect={onSelectChainConfiguration}
                       dropdownItems={chainConfigurations.map(buildDropDownItemFromSequenceConfiguration)}
                       clearable
                       placeholder={chainConfigurations.length === 0 ? "No configuration available" : "Select configuration"}
                       value={selectedChainConfiguration ? selectedChainConfiguration.toString() : undefined}
        />
    );
};

