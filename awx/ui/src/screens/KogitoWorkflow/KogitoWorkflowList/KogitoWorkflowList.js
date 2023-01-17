import {useLocation, Link} from 'react-router-dom';
import {t, Plural} from '@lingui/macro';
import {Button, ButtonType, Card, DropdownItem} from '@patternfly/react-core';
import PaginatedTable, {
    getSearchableKeys,
    HeaderCell,
    HeaderRow,
    ToolbarDeleteButton
} from "../../../components/PaginatedTable";
import DatalistToolbar from "../../../components/DataListToolbar/DataListToolbar";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {getQSConfig, parseQueryString} from "../../../util/qs";
import useToast, {AlertVariant} from "../../../hooks/useToast";
import useSelected from "../../../hooks/useSelected";

import KogitoWorkflowListItem from "./KogitoWorkflowListItem";
import useExpanded from "../../../hooks/useExpanded";
import {KogitoWorkflowsApi} from "../api";

export function KogitoWorkflowList({defaultParams}) {
    const qsConfig = getQSConfig(
        'kogito',
        {
            page: 1,
            page_size: 20,
            order_by: 'name',
            type: 'kogito_workflow',
            ...defaultParams,
        },
        ['id', 'page', 'page_size']
    );

    const [isLoading, setIsLoading] = useState(false);
    const [workflows, setWorkflows] = useState([]);
    const [error, setError] = useState();

    const location = useLocation();
    const {addToast, Toast, toastProps} = useToast();

    const {selected, isAllSelected, handleSelect, selectAll, clearSelected} =
        useSelected(workflows);

    const {expanded, isAllExpanded, handleExpand, expandAll} =
        useExpanded(workflows);

    const doRequest = useCallback(async () => {
        const params = parseQueryString(qsConfig, location.search);
        setIsLoading(true);
        try {
            const wf = await KogitoWorkflowsApi.getWorkflows();
            setWorkflows(wf);
        } catch(err) {
            setError(err)
        } finally {
            setIsLoading(false)
        }
    }, [location]);

    useEffect(() => {
        doRequest();
    }, [location])

    const handleCopy = useCallback(
        (newWorkflowId) => {
            addToast({
                id: newWorkflowId,
                title: t`Workflow copied successfully`,
                variant: AlertVariant.success,
                hasTimeout: true,
            });
        },
        [addToast]
    );

    return (
        <>
            <Card>
                <PaginatedTable
                    contentError={error}
                    hasContentLoading={isLoading}
                    items={workflows}
                    itemCount={workflows.length}
                    pluralizedItemName={t`Kogito Workflows`}
                    qsConfig={qsConfig}
                    clearSelected={clearSelected}
                    toolbarSearchColumns={[
                        {
                            name: t`Name`,
                            key: 'name__icontains',
                            isDefault: true,
                        },
                        {
                            name: t`Description`,
                            key: 'description__icontains',
                        },
                        {
                            name: t`Created By (Username)`,
                            key: 'created_by__username__icontains',
                        },
                        {
                            name: t`Modified By (Username)`,
                            key: 'modified_by__username__icontains',
                        },
                        {
                            name: t`Label`,
                            key: 'labels__name__icontains',
                        },
                    ]}
                    headerRow={
                        <HeaderRow qsConfig={qsConfig} isExpandable>
                            <HeaderCell sortKey="name">{t`Name`}</HeaderCell>
                            <HeaderCell sortKey="type">{t`Type`}</HeaderCell>
                            <HeaderCell sortKey="organization">{t`Organization`}</HeaderCell>
                            <HeaderCell sortKey="last_run">{t`Last Ran`}</HeaderCell>
                            <HeaderCell>{t`Actions`}</HeaderCell>
                        </HeaderRow>
                    }
                    renderToolbar={(props) => (
                        <DatalistToolbar
                            {...props}
                            isAllSelected={isAllSelected}
                            onSelectAll={selectAll}
                            isAllExpanded={false}
                            qsConfig={qsConfig}
                            additionalControls={[
                                <Button
                                    ouiaId="add-workflow"
                                    key="add-workflow"
                                    variant="primary"
                                    component={Link}
                                    to="/kogito/workflow/add">Add</Button>,
                                <ToolbarDeleteButton
                                    key="delete"
                                    onDelete={() => alert("delete")}
                                    itemsToDelete={selected}
                                    pluralizedItemName={t`Kogito Serverless Workflows`}
                                    deleteDetailsRequests={() => alert("detalil")}
                                    deleteMessage={
                                        <Plural
                                            value={selected.length}
                                            one="This template is currently being used by some workflow nodes. Are you sure you want to delete it?"
                                            other="Deleting these templates could impact some workflow nodes that rely on them. Are you sure you want to delete anyway?"
                                        />
                                    }
                                />,
                            ]}
                        />
                    )}
                    renderRow={(workflow, index) => (
                        <KogitoWorkflowListItem
                            key={index}
                            value={workflow.name}
                            workflow={workflow}
                            detailUrl={`/kogito/workflow/${workflow.id}/details`}
                            onSelect={() => handleSelect(workflow)}
                            isExpanded={expanded.some((row) => row.id === workflow.id)}
                            onExpand={() => handleExpand(workflow)}
                            onCopy={handleCopy}
                            isSelected={selected.some((row) => row.id === workflow.id)}
                            fetchWorkflows={doRequest}
                            rowIndex={index}
                        />
                    )}
                />
            </Card>
            <Toast {...toastProps} />
        </>
    )
}