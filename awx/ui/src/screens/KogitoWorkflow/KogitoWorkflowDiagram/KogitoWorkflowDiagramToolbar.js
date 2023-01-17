import * as React from "react";
import {useEffect, useState} from "react";

import {Button, Divider, Toolbar, ToolbarContent, ToolbarGroup, ToolbarItem, Tooltip} from "@patternfly/react-core";
import {BookIcon, RedoIcon, TimesIcon, UndoIcon} from "@patternfly/react-icons";
import {t} from "@lingui/macro";
import {KogitoWorkflowsApi} from "../api";
let render = 0;
function KogitoWorkflowDiagramToolbar({
                                          workflow,
                                          editorApi,
                                          onClose,
                                      }) {

    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if(editorApi) {
            editorApi.subscribeToContentChanges(isDirty => {
                setHasChanges(isDirty)
            });
        }
    }, [editorApi]);
    //
    return (
        <>
            <Toolbar >
                <ToolbarContent>
                    <ToolbarGroup alignment={{ default: 'alignLeft' }}>
                        <ToolbarItem>
                            {`${workflow.name} ${hasChanges ? "*" : ""}`}
                        </ToolbarItem>
                    </ToolbarGroup>
                    <ToolbarGroup variant="button-group" alignment={{ default: 'alignLeft' }}>
                        <ToolbarItem>
                            <Button variant="control" onClick={() => editorApi.undo()} isDisabled={!hasChanges}>
                                <UndoIcon/>
                            </Button>
                        </ToolbarItem>
                        <ToolbarItem>
                            <Button variant="control" onClick={() => editorApi.redo()} isDisabled={!hasChanges}>
                                <RedoIcon/>
                            </Button>
                        </ToolbarItem>
                    </ToolbarGroup>
                    <ToolbarGroup alignment={{ default: 'alignRight' }}>
                        <ToolbarItem>
                            <Tooltip content={t`Kogito Serverless Workflow documentation`} position="bottom">
                                <Button component="a" href="https://kiegroup.github.io/kogito-docs/serverlessworkflow/latest/"
                                        target="_blank"
                                        variant="pain">
                                    <BookIcon />
                                </Button>
                            </Tooltip>
                        </ToolbarItem>
                        <ToolbarItem>
                            <Button variant="primary" onClick={async () => {
                                const newContent = await editorApi.getContent();
                                workflow.diagram = newContent
                                KogitoWorkflowsApi.updateWorkflow(workflow);
                                editorApi.markAsSaved()
                            }}>Save</Button>
                        </ToolbarItem>
                        <ToolbarItem>
                            <Tooltip content="Close">
                                <Button variant="plain" onClick={() => onClose()} aria-label="Action">
                                    <TimesIcon />
                                </Button>
                            </Tooltip>
                        </ToolbarItem>
                    </ToolbarGroup>
                </ToolbarContent>
            </Toolbar>
            <Divider />
        </>
    )
}

export default KogitoWorkflowDiagramToolbar;