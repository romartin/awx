import React, {useCallback, useEffect, useState} from 'react';

import {Card, CardBody, PageSection} from "@patternfly/react-core";
import {KogitoWorkflowForm} from "../KogitoWorkflowForm";
import {KogitoWorkflowsApi} from "../api";
import {useConfig} from "../../../contexts/Config";
import {useHistory} from "react-router-dom";

function KogitoWorkflowAdd() {
    const {me = {}} = useConfig();
    const history = useHistory();

    const onSubmit = useCallback((workflowTemplate) => {
        const workflow = {
            name: workflowTemplate.name,
            description: workflowTemplate.description,
            type: workflowTemplate.type,
            created: new Date(),
            modified: new Date(),
            inputData: workflowTemplate.inputData,
            summaryFields: {
                organization: {
                    id: workflowTemplate.organization.id,
                    name: workflowTemplate.organization.name
                },
                createdBy: {
                    username: me.id,
                    id: me.username
                },
                modifiedBy: {
                    username: me.id,
                    id: me.username
                }
            }
        }

        KogitoWorkflowsApi.addWorkflow(workflow);
        history.push(`/kogito/workflow/${workflow.id}/visualizer`);
    }, []);

    const onCancel = useCallback(() => {
        history.push(`/kogito`);
    }, []);
    return (
        <PageSection>
            <Card>
                <CardBody>
                    <KogitoWorkflowForm
                        handleCancel={onCancel}
                        handleSubmit={onSubmit}/>
                </CardBody>
            </Card>
        </PageSection>
    )
}

export default KogitoWorkflowAdd;