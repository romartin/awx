import * as React from "react";
import {Button, CardBody, Label} from "@patternfly/react-core";
import {t} from "@lingui/macro";
import {Detail, DetailList, UserDateDetail} from "../../../components/DetailList";
import {Link} from "react-router-dom";
import {toTitleCase} from "../../../util/strings";
import {CardActionsRow} from "../../../components/Card";
import {VariablesDetail} from "../../../components/CodeEditor";

function KogitoWorkflowDetail({
                                  workflow
                              }) {

    const {name, description} = workflow;

    return (
        <CardBody>
            <DetailList gutter="sm">
                <Detail label={t`Name`} value={name}/>
                <Detail label={t`Description`} value={description}/>
                <Detail label={t`Workflow Type`} value={toTitleCase(workflow.type)}/>
                {workflow.summaryFields.organization && (
                    <Detail
                        label={t`Organization`}
                        value={
                            <Link
                                to={`/organizations/${workflow.summaryFields.organization.id}/details`}
                            >
                                <Label>{workflow.summaryFields.organization.name}</Label>
                            </Link>
                        }
                    />
                )}
                <UserDateDetail
                    label={t`Created`}
                    date={workflow.created}
                    user={workflow.summaryFields.createdBy}
                />
                <UserDateDetail
                    label={t`Modified`}
                    date={workflow.modified}
                    user={workflow.summaryFields.modifiedBy}
                />
                <VariablesDetail
                    label={t`Input data`}
                    value={workflow.inputData}
                    rows={4}
                    name="inputData"
                />
            </DetailList>
            <CardActionsRow>
                <Button
                    component={Link}
                    to={`/kogito/workflow/${workflow.id}/edit`}
                >
                    {t`Edit`}
                </Button>
            </CardActionsRow>
        </CardBody>
    )
}

export default KogitoWorkflowDetail;