import React, {useState, useCallback} from 'react';
import {Link} from 'react-router-dom';
import {Button, Popover, Tooltip, Chip} from '@patternfly/react-core';
import {Tr, Td, ExpandableRowContent} from '@patternfly/react-table';
import {t, Trans} from '@lingui/macro';
import {useConfig} from 'contexts/Config';
import {ActionsTd, ActionItem, TdBreakWord} from '../../../components/PaginatedTable';
import {PencilAltIcon, ProjectDiagramIcon, RocketIcon} from "@patternfly/react-icons";
import CopyButton from "../../../components/CopyButton";
import {KogitoWorkflowsApi} from "../api";

/* eslint-disable-next-line i18next/no-literal-string */
export function KogitoWorkflowListItem({
                                           isExpanded,
                                           onExpand,
                                           workflow,
                                           isSelected,
                                           onSelect,
                                           onCopy,
                                           detailUrl,
                                           fetchWorkflows,
                                           rowIndex,
                                       }) {
    const config = useConfig();
    const [isDisabled, setIsDisabled] = useState(false);
    const labelId = `check-action-${workflow.id}`;

    const copyTemplate = useCallback(async () => {
        const copy = await KogitoWorkflowsApi.copy(workflow.id);
        onCopy(copy.id);
        await fetchWorkflows();
    }, [fetchWorkflows, workflow.id, workflow.name, workflow.type, onCopy]);

    const handleCopyStart = useCallback(() => {
        setIsDisabled(true);
    }, []);

    const handleCopyFinish = useCallback(() => {
        setIsDisabled(false);
    }, []);

    return (
        <>
            <Tr>
                <Td
                    expand={{
                        rowIndex,
                        isExpanded,
                        onToggle: onExpand,
                    }}
                />
                <Td
                    select={{
                        rowIndex,
                        isSelected,
                        onSelect,
                    }}
                    dataLabel={t`Selected`}
                />
                <TdBreakWord id={labelId} dataLabel="Name">
                    <Link to={`${detailUrl}`}>
                        <b>{workflow.name}</b>
                    </Link>
                </TdBreakWord>
                <Td dataLabel={t`Type`}>
                    {workflow.type}
                </Td>
                <Td dataLabel={t`Organization`}>
                    {workflow.summaryFields.organization ? (
                        <Link
                            to={`/organizations/${workflow.summaryFields.organization.id}/details`}
                        >
                            {workflow.summaryFields.organization.name}
                        </Link>
                    ) : null}
                </Td>
                <Td dataLabel={t`Last Ran`}>-</Td>
                <ActionsTd dataLabel={t`Actions`}>
                    <ActionItem tooltip={t`Visualizer`} visible>
                        <Button
                            variant="plain"
                            component={Link}
                            to={`/kogito/workflow/${workflow.id}/visualizer`}>
                            <ProjectDiagramIcon/>
                        </Button>
                    </ActionItem>
                    <ActionItem tooltip={t`Launch`} visible>
                        <Button
                            ouiaId={`${workflow.id}-launch-button`}
                            id={`workflow-action-launch-${workflow.id}`}
                            aria-label={t`Launch`}
                            variant="plain"
                            onClick={() => alert('Launching...')}
                        >
                            <RocketIcon />
                        </Button>
                    </ActionItem>
                    <ActionItem tooltip={t`Edit`} visible>
                        <Button
                            ouiaId={`${workflow.id}-edit-button`}
                            id={`workflow-action-edit-${workflow.id}`}
                            isDisabled={isDisabled}
                            aria-label={t`Edit`}
                            variant="plain"
                            component={Link}
                            to={`/kogito/workflow/${workflow.id}/edit`}
                        >
                            <PencilAltIcon />
                        </Button>
                    </ActionItem>
                    <ActionItem tooltip={t`Copy `} visible>
                        <CopyButton
                            id={`template-action-copy-${workflow.id}`}
                            errorMessage={t`Failed to copy template.`}
                            isDisabled={isDisabled}
                            onCopyStart={handleCopyStart}
                            onCopyFinish={handleCopyFinish}
                            copyItem={copyTemplate}
                        />
                    </ActionItem>
                </ActionsTd>
            </Tr>
            <Tr
                isExpanded={isExpanded}
            >
                <Td cols={6}>
                    <ExpandableRowContent>
                        bla bla bla
                    </ExpandableRowContent>
                </Td>
            </Tr>
        </>
    )
}

export {KogitoWorkflowListItem as _KogitoWorkflowListItem};
export default KogitoWorkflowListItem;