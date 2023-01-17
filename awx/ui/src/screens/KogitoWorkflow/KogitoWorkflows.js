import {Route, withRouter, Switch} from 'react-router-dom';
import {PageSection} from '@patternfly/react-core';
import ScreenHeader from "../../components/ScreenHeader";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {t} from "@lingui/macro";
import PersistentFilters from "../../components/PersistentFilters";
import {KogitoWorkflowList} from "./KogitoWorkflowList/KogitoWorkflowList";
import KogitoWorkflow from "./KogitoWorkflow";
import KogitoWorkflowAdd from "./KogitoWorkflowAdd";

function KogitoWorkflows() {
    const initScreenHeader = useRef({
        '/kogito': t`Kogito Workflows`,
        '/kogito/workflow/add': t`Create New Kogito Workflow`,
    });
    const [breadcrumbConfig, setScreenHeader] = useState(
        initScreenHeader.current
    );

    const [workflow, setWorkflow] = useState();

    const setBreadcrumbConfig = useCallback(
        (passedWorkflow) => {
            if (passedWorkflow && passedWorkflow.name !== workflow?.name) {
                setWorkflow(passedWorkflow);
            }
        },
        [workflow]
    );

    useEffect(() => {
        if (!workflow) return;
        const workflowTemplate = `/kogito/workflow/${workflow.id}`;
        setScreenHeader({
            ...initScreenHeader.current,
            [workflowTemplate]: `${workflow.name}`,
            [`${workflowTemplate}/details`]: t`Details`,
            [`${workflowTemplate}/edit`]: t`Edit Details`,
            [`${workflowTemplate}/access`]: t`Access`,
            [`${workflowTemplate}/notifications`]: t`Notifications`,
            [`${workflowTemplate}/jobs`]: t`Jobs`,
            [`${workflowTemplate}/visualizer`]: t`Visualizer`,
        });
    }, [workflow])
    return (
        <>
            <ScreenHeader
                streamType="kogito_workflow,kogito_workflows"
                breadcrumbConfig={breadcrumbConfig}/>
            <Switch>
                <Route path="/kogito/workflow/add">
                    <KogitoWorkflowAdd/>
                </Route>
                <Route path="/kogito/workflow/:id">
                    <PageSection>
                        <KogitoWorkflow setBreadcrumb={setBreadcrumbConfig}/>
                    </PageSection>
                </Route>
                <Route path="/kogito">
                    <PageSection>
                        <PersistentFilters pageKey="kogito">
                            <KogitoWorkflowList/>
                        </PersistentFilters>
                    </PageSection>
                </Route>
            </Switch>
        </>
    )
}

export {KogitoWorkflows as _KogitoWorkflows};
export default withRouter(KogitoWorkflows);