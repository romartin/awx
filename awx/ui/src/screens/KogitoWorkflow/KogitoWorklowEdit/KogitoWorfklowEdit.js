import React from "react";
import {KogitoWorkflowForm} from "../KogitoWorkflowForm";
import {CardBody} from "@patternfly/react-core";
import {useConfig} from "../../../contexts/Config";
import {useHistory} from "react-router-dom";
import {KogitoWorkflowsApi} from "../api";

export function KogitoWorfklowEdit({
                                       workflow
                                   }) {

    const {me = {}} = useConfig();
    const history = useHistory();

    const onSubmit = (workflowEditedData) => {
        const workflowToUpdate = {
            ...workflow,
            ...workflowEditedData
        }
        workflowToUpdate.modified = new Date();
        workflowToUpdate.summaryFields.modifiedBy = {
            username: me?.username,
            id: me?.id
        }
        KogitoWorkflowsApi.updateWorkflow(workflowToUpdate);
        onCancel();
    }

    const onCancel = () => {
        history.push(`/kogito/workflow/${workflow.id}/details`);
    };

    return (
        <CardBody>
            <KogitoWorkflowForm workflow={workflow}
                                handleCancel={onCancel}
                                handleSubmit={onSubmit}/>
        </CardBody>
    )
}

export default KogitoWorfklowEdit;