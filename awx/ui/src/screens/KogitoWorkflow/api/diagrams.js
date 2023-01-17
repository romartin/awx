export const jsonGreetings = {
    "id": "jsongreet",
    "version": "1.0",
    "name": "Greeting workflow",
    "description": "JSON based greeting workflow",
    "start": "ChooseOnLanguage",
    "functions": [
        {
            "name": "greetFunction",
            "type": "custom",
            "operation": "sysout"
        }
    ],
    "states": [
        {
            "name": "ChooseOnLanguage",
            "type": "switch",
            "dataConditions": [
                {
                    "condition": "${ .language == \"English\" }",
                    "transition": "GreetInEnglish"
                },
                {
                    "condition": "${ .language == \"Spanish\" }",
                    "transition": "GreetInSpanish"
                }
            ],
            "defaultCondition": {
                "transition": "GreetInEnglish"
            }
        },
        {
            "name": "GreetInEnglish",
            "type": "inject",
            "data": {
                "greeting": "Hello from JSON Workflow, "
            },
            "transition": "GreetPerson"
        },
        {
            "name": "GreetInSpanish",
            "type": "inject",
            "data": {
                "greeting": "Saludos desde JSON Workflow, "
            },
            "transition": "GreetPerson"
        },
        {
            "name": "GreetPerson",
            "type": "operation",
            "actions": [
                {
                    "name": "greetAction",
                    "functionRef": {
                        "refName": "greetFunction",
                        "arguments": {
                            "message": ".greeting+.name"
                        }
                    }
                }
            ],
            "end": {
                "terminate": "true"
            }
        }
    ]
}

export function getDefaultSWF(type, id, name, description) {
    return type === "json" ? getDefaultJSON(id, name, description) : getDefaultYAML(id, name, description);
}
export function getDefaultJSON(id, name, description) {
    return `{
  "id": "${id}",
  "version": "0.1",
  "specVersion": "0.8",
  "name": "${name}",
  "description": "${description}",
  "start": "StartState",
  "functions": [
    {
      "name": "uniqueFunctionName",
      "operation": "localhost#operation",
      "type": "rest"
    }
  ],
  "events": [
    {
      "name": "Unique event name",
      "source": "CloudEvent source",
      "type": "CloudEvent type"
    }
  ],
  "states": [
    {
      "name": "StartState",
      "type": "operation",
      "actions": [
        {
          "name": "uniqueActionName",
          "functionRef": {
            "refName": "uniqueFunctionName",
            "arguments": {
              "firstArgument": "",
              "secondArgument": ""
            }
          }
        }
      ],
      "end": true
    }
  ]
}`
}

export function getDefaultYAML(id, name, description) {
    return `id: "${id}"
version: "0.1"
specVersion: "0.8"
name: "${name}"
description: "${description}"
start: "StartState"
functions:
   - name: "uniqueFunctionName"
     operation: "localhost#operation"
     type: "rest"
events:
   - name: "Unique event name"
     source: "CloudEvent source"
     type: "CloudEvent type"
states:
   - name: "StartState"
     type: "operation"
     actions:
       - name: "uniqueActionName"
         functionRef: 
           refName: "uniqueFunctionName"
           arguments: 
             firstArgument: ""
             secondArgument: ""
     end: true`;
}

export const yamlGreetings = "id: yamlgreet\n" +
    "version: '1.0'\n" +
    "name: Greeting workflow\n" +
    "description: YAML based greeting workflow\n" +
    "expressionLang: jsonpath\n" +
    "start: ChooseOnLanguage\n" +
    "functions:\n" +
    "  - name: greetFunction\n" +
    "    type: custom\n" +
    "    operation: sysout\n" +
    "states:\n" +
    "  - name: ChooseOnLanguage\n" +
    "    type: switch\n" +
    "    dataConditions:\n" +
    "      - condition: \"${$.[?(@.language  == 'English')]}\"\n" +
    "        transition: GreetInEnglish\n" +
    "      - condition: \"${$.[?(@.language  == 'Spanish')]}\"\n" +
    "        transition: GreetInSpanish\n" +
    "    defaultCondition:\n" +
    "      transition: GreetInEnglish\n" +
    "  - name: GreetInEnglish\n" +
    "    type: inject\n" +
    "    data:\n" +
    "      greeting: 'Hello from YAML Workflow, '\n" +
    "    transition: GreetPerson\n" +
    "  - name: GreetInSpanish\n" +
    "    type: inject\n" +
    "    data:\n" +
    "      greeting: 'Saludos desde YAML Workflow, '\n" +
    "    transition: GreetPerson\n" +
    "  - name: GreetPerson\n" +
    "    type: operation\n" +
    "    actions:\n" +
    "      - name: greetAction\n" +
    "        functionRef:\n" +
    "          refName: greetFunction\n" +
    "          arguments:\n" +
    "            message: \"$.greeting $.name\"\n" +
    "    end:\n" +
    "      terminate: true\n";