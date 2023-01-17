import {UnifiedJobTemplatesAPI} from "../../../api";
import {JOB_TEMPLATE, WORKFLOW_JOB_TEMPLATE} from "./messages";
import {ArgumentsBuilderFactory} from "./argumentsBuilderFactory";

function getFunctionArgsDescription(funcArgs) {
    let args = "";
    let extraVars = "";
    if(funcArgs) {
        Object.entries(funcArgs).forEach(entry => {
            const [argName, argData] = entry;
            const argDesc = `${argName}: "${argData.type}"\n`;
            if(argData.group) {
                extraVars += argDesc;
            } else {
                args += argDesc;
            }
        })
    }
    if(args || extraVars) {
        let result = args;
        if(extraVars) {
            result += `Extra_vars:\n${extraVars}`;
        }
        return result
    }
    return args || undefined
}

function getFunctionDescription (template, funcArgs) {
    const args = getFunctionArgsDescription(funcArgs);
    return `AWX ${template.type === JOB_TEMPLATE ? "Job Template" : "Workflow Job Template"}
Name: ${template.name}
Id: ${template.id}) 
${template.description ? `\nDescription: ${template.description}` : ""}
${!args ? "" : `\nArguments: \n${args}`}`;
}

async function buildSWFCatalogFunction(template) {
    const argsBuilder = ArgumentsBuilderFactory.getBuilder(template.type);
    const funcArgs = await argsBuilder.buildTemplateArguments(template);

    return {
        "name": template.name,
        "type": "rest",
        "arguments": funcArgs,
        "source": {
            "type": "remote",
            "registry": "AWX",
            "resource": template.type === JOB_TEMPLATE ? "Job Templates" : "Workflow Job Templates",
            "operation": template.related.launch,
        },
        "description": getFunctionDescription(template, funcArgs)
    };
}

export default async function getAnsibleCatalog() {
    try {
        const response = await UnifiedJobTemplatesAPI.read({
            type: `${JOB_TEMPLATE},${WORKFLOW_JOB_TEMPLATE}`
        })

        const templates = response.data.results;

        const templateFunctions = await Promise.all(templates
            .map(async (template) => buildSWFCatalogFunction(template)));

        const service = {
            "name": "AWX",
            "type": "rest",
            "functions": templateFunctions,
            "source": {
                "type": "remote",
                "url": "http://localhost:3001",
            }
        }

        return [service];
    } catch (err) {
        alert(err)
    }
    return []
}