import * as React from "react";
import styled from 'styled-components';
import {useRef, useEffect, useState} from "react";

// ***************************************************************************
// TODO: Work in progress
// - A copy of the standalone editor version embedded js file can be found here: KogitoWorkflowDiagramORIGINAL.js
// - The version (wip) for using the embedded "combined-editor" can be found here: KogitoWorkflowDiagramNEW.js
// ***************************************************************************


// TODO: Enable.
//import * as SwfEditor from "@kie-tools/kie-editors-standalone/dist/swf";
import {useHistory} from "react-router-dom";
import KogitoWorkflowDiagramToolbar from "./KogitoWorkflowDiagramToolbar";
//import getAnsibleCatalog from "../serviceCatalog";

const Wrapper = styled.div`
  height: 100%;
`;

function KogitoWorkflowDiagram({
                                   workflow
                               }) {
    const history = useHistory();
    const containerRef = useRef();
    const [editorApi, setEditorApi] = useState(undefined);

    useEffect(() => {
        // TODO: Enable.
        if (false) {
            const editor = SwfEditor.open({
                container: containerRef.current,
                initialContent: Promise.resolve(workflow.diagram),
                languageType: workflow.type,
                readOnly: false
                // TODO: Ansible - serviceCatalogProvider: () => getAnsibleCatalog()
            });
            setEditorApi(editor);
        }
    }, []);

    return (
        <Wrapper>
            <KogitoWorkflowDiagramToolbar
                editorApi={editorApi}
                workflow={workflow}
                onClose={() => {
                    history.push(`/kogito/workflow/${workflow.id}/details`);
                }}/>
            <Wrapper ref={containerRef} id="diagram-container"/>
        </Wrapper>
    )
}

export default KogitoWorkflowDiagram;