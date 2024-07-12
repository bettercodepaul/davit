import React, { FunctionComponent } from "react";
import { GoToTypesChain } from "../../../../../../../../dataAccess/access/types/GoToTypeChain";
import {
    ChainDecisionDropDown,
    ChainLinkDropDown,
    DavitAddButton,
    DavitBackButton,
    DavitButton,
    DavitDeleteButton,
    DavitTextInput,
    Form,
    GoToChainOptionDropDown,
    SequenceDropDown
} from "../../../../../../../atomic";
import { FormBody } from "../../../../../../../atomic/forms/fragments/FormBody";
import { FormFooter } from "../../../../../../../atomic/forms/fragments/FormFooter";
import { FormHeader } from "../../../../../../../atomic/forms/fragments/FormHeader";
import { useChainLinkViewModel } from "../viewmodels/ChainLinkViewModel";
import { FormDivider } from "./fragments/FormDivider";
import { FormLabel } from "./fragments/FormLabel";
import { FormLine } from "./fragments/FormLine";

interface ChainLinkFormProps {
}

export const ChainLinkForm: FunctionComponent<ChainLinkFormProps> = () => {

    const {
        name,
        createGoToDecision,
        changeName,
        chainId,
        createNewChainLink,
        currentSequence,
        deleteChainLink,
        goTo,
        handleType,
        isRoot,
        linkId,
        saveChainLink,
        setNextDecision,
        setNextLink,
        setRoot,
        setSequenceModel,
    } = useChainLinkViewModel();

    const labelDataSetup: string = "Select data-setup";
    const labelSequence: string = "Select sequence";
    const labelGoToType: string = "Select type of the next";
    const labelSelectLink: string = "Select next link";
    const labelCreateLink: string = "Create next link";
    const labelSelectDecision: string = "Select next decision";
    const labelCreateDecision: string = "Create next decision";

    return (
        <Form>
            <FormHeader>
                <h2>Chain link</h2>
            </FormHeader>

            <FormDivider />

            <FormBody>

                <FormLine>
                    <DavitTextInput
                        label="Name:"
                        placeholder="Chainlink Name ..."
                        onChangeCallback={(name: string) => changeName(name)}
                        value={name}
                        focus={true}
                    />
                </FormLine>

                <FormDivider />

                <FormLine>
                    <FormLabel>{labelDataSetup}</FormLabel>
                {/*    TODO: add sequence configuration drop down*/}
                </FormLine>

                <FormDivider />

                <FormLine>
                    <FormLabel>{labelSequence}</FormLabel>
                    <SequenceDropDown
                        onSelect={(seqModel) => setSequenceModel(seqModel)}
                        value={currentSequence}
                    />
                </FormLine>

                <FormDivider />

                <FormLine>
                    <FormLabel>{labelGoToType}</FormLabel>
                    <GoToChainOptionDropDown
                        onSelect={handleType}
                        value={goTo ? goTo.type : GoToTypesChain.ERROR}
                    />
                </FormLine>

                {goTo.type === GoToTypesChain.LINK && (
                    <>
                        <FormDivider />

                        <FormLine>
                            <FormLabel>{labelSelectLink}</FormLabel>
                            <DavitAddButton onClick={createNewChainLink} />
                        </FormLine>
                        <FormLine>
                            <FormLabel>{labelCreateLink}</FormLabel>
                            <ChainLinkDropDown
                                onSelect={setNextLink}
                                value={goTo?.type === GoToTypesChain.LINK ? goTo.id : 1}
                                chainId={chainId}
                                exclude={linkId}
                            />
                        </FormLine>
                    </>
                )}
                {goTo.type === GoToTypesChain.DEC && (
                    <>
                        <FormDivider />

                        <FormLine>
                            <FormLabel>{labelSelectDecision}</FormLabel>
                            <DavitAddButton onClick={createGoToDecision} />
                        </FormLine>
                        <FormLine>
                            <FormLabel>{labelCreateDecision}</FormLabel>
                            <ChainDecisionDropDown
                                onSelect={(cond) => setNextDecision(cond)}
                                value={goTo?.type === GoToTypesChain.DEC ? goTo.id : 1}
                                chainId={chainId}
                            />
                        </FormLine>
                    </>
                )}

            </FormBody>

            <FormDivider />

            <FormFooter>
                <DavitDeleteButton onClick={deleteChainLink}
                                   disabled={isRoot}
                />
                <DavitButton onClick={setRoot}
                             disabled={isRoot}
                >
                    {isRoot ? "Start" : "Set as Start"}
                </DavitButton>
                <DavitBackButton onClick={saveChainLink} />
            </FormFooter>


        </Form>
    );
};
