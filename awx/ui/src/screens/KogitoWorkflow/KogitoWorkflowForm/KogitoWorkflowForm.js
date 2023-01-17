import React, {useCallback, useEffect, useState} from 'react';
import {t} from '@lingui/macro';
import {FormColumnLayout, FormFullWidthLayout} from "../../../components/FormLayout";
import {Form, FormGroup, FormSelect, FormSelectOption} from "@patternfly/react-core";
import {required} from 'util/validators';
import FormField from "../../../components/FormField";
import {OrganizationLookup} from "../../../components/Lookup";
import {useField, useFormikContext, withFormik} from "formik";
import {VariablesField} from "../../../components/CodeEditor";
import FormActionGroup from "../../../components/FormActionGroup";
import AnsibleSelect from "../../../components/AnsibleSelect";

function KogitoWorkflowForm({
                                workflow,
                                handleSubmit,
                                handleCancel,
                            }) {

    const {setFieldValue, setFieldTouched} = useFormikContext();
    const [organizationField, organizationMeta, organizationHelpers] =
        useField('organization');
    const handleOrganizationChange = useCallback(
        (value) => {
            setFieldValue('organization', value);
            setFieldTouched('organization', true, false);
        },
        [setFieldValue, setFieldTouched]
    );

    const [typeField, typeMeta, typeHelpers] = useField({
        name: 'type',
        validate: required(null),
    });

    return (
        <Form autoComplete="off" onSubmit={handleSubmit}>
            <FormColumnLayout>
                <FormField
                    id="wfjt-name"
                    name="name"
                    type="text"
                    label={t`Name`}
                    isRequired
                    validate={required(null)}
                />
                <FormField
                    id="wfjt-description"
                    name="description"
                    type="text"
                    label={t`Description`}
                />
                <FormGroup
                    id="wf-type-group"
                    type="string"
                    fieldId="wf-type"
                    label="Workflow Type"
                >
                    <AnsibleSelect
                        {...typeField}
                        isValid={!typeMeta.touched || !typeMeta.error}
                        id="wf-type"
                        data={[{ label: 'JSON', key: 1, value: 'json' }, {label: 'YAML', key: 2, value: 'yaml'}]}
                        onChange={(event, value) => {
                            typeHelpers.setValue(value);
                        }}
                    />
                </FormGroup>
                <OrganizationLookup
                    helperTextInvalid={organizationMeta.error}
                    isValid={!organizationMeta.touched || !organizationMeta.error}
                    onBlur={() => organizationHelpers.setTouched()}
                    onChange={handleOrganizationChange}
                    value={organizationField.value}
                    touched={organizationMeta.touched}
                    error={organizationMeta.error}
                />
            </FormColumnLayout>
            <FormFullWidthLayout>
                <VariablesField
                    id="wfjt-inputData"
                    name="inputData"
                    label={t`Input data`}
                />
            </FormFullWidthLayout>
            <FormActionGroup onCancel={handleCancel} onSubmit={handleSubmit}/>
        </Form>
    )
}

const FormikApp = withFormik({
    mapPropsToValues({workflow = {}}) {
        return {
            name: workflow.name || '',
            description: workflow.description || '',
            type: workflow.type || 'json',
            organization: workflow?.summaryFields?.organization || null,
            inputData: workflow.inputData || '',
        };
    },
    handleSubmit: async (values, {props, setErrors}) => {
        try {
            await props.handleSubmit(values);
        } catch (errors) {
            setErrors(errors);
        }
    },
})(KogitoWorkflowForm);

export {KogitoWorkflowForm as _KogitoWorkflowForm}

export default FormikApp;