import {getDefaultJSON, getDefaultSWF, jsonGreetings, yamlGreetings} from "./diagrams";
import {timeOfDay} from "../../../util/dates";

const defaultData = JSON.stringify([
    {
        id: "0",
        name: "Greetings (JSON)",
        description: "A greetings example in json format",
        type: "json",
        summaryFields: {
            organization: {
                id: "1",
                name: "Default"
            },
            createdBy: {
                username: "admin",
                id: 1
            },
            modifiedBy: {
                username: "awx",
                id: 2
            }
        },
        created: new Date(),
        modified: new Date(),
        diagram: JSON.stringify(jsonGreetings, null, 2),
        inputData: "",
    },
    {
        id: "1",
        name: "Greetings (YAML)",
        description: "A greetings example in yaml format",
        type: "yaml",
        summaryFields: {
            organization: {
                id: "1",
                name: "Default"
            },
            createdBy: {
                username: "admin",
                id: 1
            },
            modifiedBy: {
                username: "awx",
                id: 2
            }
        },
        created: new Date(),
        modified: new Date(),
        diagram: yamlGreetings,
        inputData: "",
    },
]);

export class KogitoWorkflows {

    constructor() {
        /*let storageValue = window.localStorage.getItem("kogito");
        if (!storageValue) {
            window.localStorage.setItem("kogito", defaultData);
            storageValue = defaultData;
        }*/
        this.store = JSON.parse(defaultData);
        this.nextId = this.store.length + 1;
    }

    getWorkflows() {
        return Promise.resolve(this.store);
    }

    getWorkflowById(workflowId) {
        return new Promise((resolve, reject) => {
            const result = this.store.find(workflow => workflow.id === workflowId);
            if (result) {
                resolve(result);
            } else {
                reject(new Error(`Cannot find workflow with id '${workflowId}'`))
            }
        });
    }

    addWorkflow(workflow) {
        this.store.push(workflow);
        workflow.id = String(this.nextId);
        if(!workflow.diagram) {
            workflow.diagram = getDefaultSWF(
                workflow.type,
                workflow.id,
                workflow.name,
                workflow.description);
        }
        this.nextId++;
    }

    updateWorkflow(workflow) {
        const index = this.store.map(wf => wf.id)
            .indexOf(workflow.id);

        if (index !== -1) {
            this.store.splice(index, 1, workflow);
        } else {
            this.addWorkflow(workflow);
        }
    }

    removeWorkflow(workflowId) {
        this.store = this.store.filter(workflow => workflow.id !== workflowId);
    }

    copy(workflowId) {
        const index = this.store.map(wf => wf.id)
            .indexOf(workflowId);

        if (index !== -1) {
            const currentWorkflow = this.store[index];
            const newWorkflow = JSON.parse(JSON.stringify(currentWorkflow));
            newWorkflow.name = `${currentWorkflow.name} @ ${timeOfDay()}`;
            this.addWorkflow(newWorkflow);
            return Promise.resolve(newWorkflow);
        }

        return Promise.reject(new Error(`Couldn't find the workflow with id: '${workflowId}'`));
    }
}