import {
    Switch,
    Route,
    Redirect,
    Link,
    useLocation,
    useParams,
    useRouteMatch,
} from 'react-router-dom';
import {t} from "@lingui/macro";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Card, PageSection} from "@patternfly/react-core";
import ContentError from "../../components/ContentError";
import ContentLoading from "../../components/ContentLoading";
import KogitoWorkflowDetail from "./KogitoWorkflowDetail";
import RoutedTabs from "../../components/RoutedTabs";
import {CaretLeftIcon} from "@patternfly/react-icons";
import KogitoWorkflowDiagram from "./KogitoWorkflowDiagram";
import AppendBody from "../../components/AppendBody";
import FullPage from "../../components/FullPage";
import {KogitoWorkflowsApi} from "./api";
import KogitoWorfklowEdit from "./KogitoWorklowEdit/KogitoWorfklowEdit";

function KogitoWorkflow({setBreadcrumb}) {
    const location = useLocation();
    const match = useRouteMatch();
    const {id: workflowId} = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [workflow, setWorkflow] = useState();
    const [error, setError] = useState();

    const doRequest = useCallback(() => {
        setIsLoading(true);
        KogitoWorkflowsApi.getWorkflowById(workflowId)
            .then(wf => {
                setWorkflow(wf);
                setBreadcrumb(wf);
            })
            .catch(err => setError(err))
            .finally(() => setIsLoading(false))
    }, [location]);

    useEffect(() => {
        doRequest();
    }, [location]);

    if (isLoading) {
        return (
            <PageSection>
                <Card>
                    <ContentLoading/>
                </Card>
            </PageSection>
        )
    }

    if (error) {
        return (
            <PageSection>
                <Card>
                    <ContentError error={error}></ContentError>
                </Card>
            </PageSection>
        );
    }

    const tabsArray = [
        {
            name: (
                <>
                    <CaretLeftIcon/>
                    {t`Back to Workflows`}
                </>
            ),
            link: `/kogito`,
            isBackButton: true,
        },
        {name: t`Details`, link: `${match.url}/details`},
        {name: t`Visualizer`, link: `${match.url}/visualizer`},
    ];

    tabsArray.forEach((tab, n) => {
        tab.id = n;
    });

    const showCardHeader = !(
        location.pathname.endsWith('edit') ||
        location.pathname.includes('survey/')
    );

    return (
        <PageSection>
            <Card>
                {showCardHeader && <RoutedTabs tabsArray={tabsArray}/>}
                <Switch>
                    <Redirect
                        from="/kogito/workflow/:id"
                        to="/kogito/workflow/:id/details"
                        exact
                    />
                    <Route path="/kogito/workflow/:id/details">
                        <KogitoWorkflowDetail workflow={workflow}/>
                    </Route>
                    <Route path="/kogito/workflow/:id/edit">
                        <KogitoWorfklowEdit workflow={workflow}/>
                    </Route>
                    <Route path="/kogito/workflow/:id/visualizer">
                        <AppendBody>
                            <FullPage>
                                <KogitoWorkflowDiagram workflow={workflow}/>
                            </FullPage>
                        </AppendBody>
                    </Route>
                </Switch>
            </Card>
        </PageSection>
    )
}

export {KogitoWorkflow as _KogitoWorkflow}
export default KogitoWorkflow