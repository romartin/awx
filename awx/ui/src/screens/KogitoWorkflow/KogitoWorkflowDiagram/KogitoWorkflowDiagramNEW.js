import * as React from "react";
import styled from 'styled-components';
import {useRef, useEffect, useState, useMemo, useCallback} from "react";
import { EmbeddedEditor, useEditorRef } from "@kie-tools-core/editor/dist/embedded";
import { ChannelType, EditorEnvelopeLocator, EnvelopeContentType, EnvelopeMapping } from "@kie-tools-core/editor/dist/api";
// import "@kie-tools/serverless-workflow-combined-editor/dist/editor/index.js";

const Wrapper = styled.div`
  height: 100%;
`;

function KogitoWorkflowDiagram({
                                   workflow
                               }) {
    const containerRef = useRef();
    const LOCALE = 'en';
    const DEFAULT_FILENAME = 'fileName.sw.json';

    const { editor, editorRef } = useEditorRef();
    const [embeddedFile, setEmbeddedFile] = useState({
        path: DEFAULT_FILENAME,
        getFileContents: async () => workflow.diagram,
        isReadOnly: false,
        fileExtension: 'sw.json',
        fileName: DEFAULT_FILENAME,
      });

    const ENVELOPE_CONTENT = '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '  <head>\n' +
    '    <style>\n' +
    '      html,\n' +
    '      body,\n' +
    '      div#envelope-app {\n' +
    '        margin: 0;\n' +
    '        border: 0;\n' +
    '        padding: 0;\n' +
    '        overflow: hidden;\n' +
    '        height: 100%;\n' +
    '        width: 100%;\n' +
    '      }\n' +
    '    </style>\n' +
    '\n' +
    '    <title></title>\n' +
    '    <meta charset="UTF-8" />\n' +
    '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n' +
    '    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n' +
    '  </head>\n' +
    '  <body>\n' +
    '    <div id="combined-envelope-app"></div>\n' +
    '    <script src="serverless-workflow-combined-editor-envelope.js"></script>\n' +
    '  </body>\n' +
    '</html>\n';

    const envelopeLocator = useMemo(
        () =>
            new EditorEnvelopeLocator(window.location.origin, [
            new EnvelopeMapping({
                type: 'swf',
                filePathGlob: '**/*.sw.json',
                resourcesPathPrefix: '',
                envelopeContent: {
                    //type: EnvelopeContentType.PATH,
                    //path: '/serverless-workflow-combined-editor-envelope.html',
                    type: EnvelopeContentType.CONTENT,
                    content: ENVELOPE_CONTENT
                },
            }),
            ]),
        [],
    );

    return (
        <Wrapper>
            <EmbeddedEditor
                 key= 'ansibleWorkflowEmbeddedEditor'
                 ref={editorRef}
                 locale={LOCALE}
                 channelType={ChannelType.ONLINE}
                 file={embeddedFile}
                 editorEnvelopeLocator={envelopeLocator}
            />
            <Wrapper ref={containerRef} id="diagram-container"/>
        </Wrapper>
    )
}

export default KogitoWorkflowDiagram;