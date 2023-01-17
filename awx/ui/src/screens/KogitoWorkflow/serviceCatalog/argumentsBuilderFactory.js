import {JobTemplatesAPI, WorkflowJobTemplatesAPI} from "../../../api";
import {
    JOB_TEMPLATE,
    WORKFLOW_JOB_TEMPLATE,
    BRANCH_DESC,
    INVENTORY_DESC,
    JOB_TAGS_DESC,
    LIMIT_DESC,
    SKIP_TAGS_DESC,
    JOB_TYPE_DESC,
    EXEC_ENV_DESC,
    CREDENTIALS_DESC,
    FORKS_DESC,
    VERBOSITY_DESC,
    JOB_SLICE_DESC,
    SHOW_DIFF_DESC,
    TIMEOUT_DESC
} from "./messages";

function resolveTemplateCredentials(template) {
    return template.summary_fields?.credentials.map(credential => credential.id) || []
}

const BLANK_TYPES = ["integer", "number"];

function getDefaultValue(value, dataType) {
    if(BLANK_TYPES.includes(dataType)) {
        return value !== undefined ? value : undefined;
    }
    return value || undefined;
}

function getArgumentDescription(args) {
    const realType = resolveRealType(args.type);
    const defaultValue = args.type !== "password" ? getDefaultValue(args.defaultValue, realType) : undefined;

    let description = "";

    if (args.description) description += (`Description: ${args.description}`);
    description +=  `\n\nType: \`${realType}\``;
    if (args.required) description += `\n\nRequired: ${args.required}`;
    if (defaultValue) description += `\n\nDefault value: \`${defaultValue}\``;
    if (args.min) description += `\n\nMin. value: \`${args.min}\``;
    if (args.max) description += `\n\nMax. value: \`${args.max}\``;
    if (args.options) description += `\n\nPossible values: \`${args.options}\``;

    return description;
}

function resolveRealType(ansibleType) {
    switch (ansibleType) {
        case "multiselect":
            return  "array";
        case "float":
            return "number";
        case "text":
        case "textarea":
        case "password":
        case "multiplechoice":
            return "string";
        default:
            return ansibleType
    }
}

function buildFunctionArgument(type, group, defaultValue, description) {
    const argType = resolveRealType(type);

    return {
        "type": argType,
        "group": group || undefined,
        "defaultValue": getDefaultValue(defaultValue, argType),
        "description": description || undefined
    }
}

class DefaultArgumentBuilder {
    // eslint-disable-next-line class-methods-use-this
    async getTemplateLaunchVariables(templateApi, template) {
        const result = {}
        if(template.ask_variables_on_launch) {
            const variablesResponse = await templateApi.readLaunch(template.id);
            variablesResponse?.data?.variables_needed_to_start.forEach(variable => {
                result[`${variable}`] = buildFunctionArgument("variable", "extra_vars");
            });
        }

        return result;
    }

    // eslint-disable-next-line class-methods-use-this
    async getSurveyArguments(templateApi, template) {
        const result = {}
        if(template.survey_enabled) {
            const surveyResponse = await templateApi.readSurvey(template.id);
            surveyResponse?.data?.spec.forEach(surveyItem => {

                const description = getArgumentDescription({
                    description: surveyItem.question_description || undefined,
                    type: surveyItem.type,
                    defaultValue: surveyItem.default,
                    required: surveyItem.required,
                    min: surveyItem.min,
                    max: surveyItem.min,
                });

                result[`${surveyItem.variable}`] = buildFunctionArgument(surveyItem.type,
                    "extra_vars",
                    surveyItem.default,
                    description);
            });
        }

        return result;
    }
}

class JobTemplateArgumentBuilder extends DefaultArgumentBuilder {
    constructor() {
        super();
        this.templateApi = JobTemplatesAPI;
    }

    // eslint-disable-next-line class-methods-use-this
    async buildTemplateArguments(template) {
        const launchVariables = await this.getTemplateLaunchVariables(this.templateApi, template);
        const surveyVariables = await this.getSurveyArguments(this.templateApi, template);
        return  {
            ...template.ask_job_type_on_launch ? { job_type: buildFunctionArgument("string", undefined, template.job_type, JOB_TYPE_DESC)} : undefined,
            ...template.ask_inventory_on_launch ? { inventory: buildFunctionArgument("integer", undefined, template.inventory, INVENTORY_DESC)} : undefined,
            ...template.ask_execution_environment_on_launch ? { execution_environment: buildFunctionArgument("integer", undefined, template.execution_environment, EXEC_ENV_DESC)} : undefined,
            ...template.ask_credential_on_launch ? { credential: buildFunctionArgument("multiselect", undefined, resolveTemplateCredentials(template), CREDENTIALS_DESC)} : undefined,
            ...template.ask_forks_on_launch ? { forks: buildFunctionArgument("multiselect", undefined, template.forks, FORKS_DESC)} : undefined,
            ...template.ask_limit_on_launch ? { limit: buildFunctionArgument("string", undefined, template.limit, LIMIT_DESC)} : undefined,
            ...template.ask_verbosity_on_launch ? { verbosity: buildFunctionArgument("integer", undefined, template.verbosity, VERBOSITY_DESC)} : undefined,
            ...template.ask_job_slice_count_on_launch ? { job_slice_count: buildFunctionArgument("integer", undefined, template.job_slice_count, JOB_SLICE_DESC)} : undefined,
            ...template.ask_timeout_on_launch ? { timeout: buildFunctionArgument("integer", undefined, template.timeout, TIMEOUT_DESC)} : undefined,
            ...template.ask_diff_mode_on_launch ? { diff_mode: buildFunctionArgument("boolean", undefined, template.diff_mode, SHOW_DIFF_DESC)} : undefined,
            ...template.ask_tags_on_launch ? { job_tags: buildFunctionArgument("string", undefined, template.job_tags, JOB_TAGS_DESC)} : undefined,
            ...template.ask_skip_tags_on_launch ? { skip_tags: buildFunctionArgument("string", undefined, template.skip_tags, SKIP_TAGS_DESC)} : undefined,
            ...launchVariables,
            ...surveyVariables
        };
    }
};

class WorkflowJobTemplateArgumentBuilder extends DefaultArgumentBuilder {
    constructor() {
        super();
        this.templateApi = WorkflowJobTemplatesAPI;
    }

    // eslint-disable-next-line
    async buildTemplateArguments(template) {
        const launchVariables = await this.getTemplateLaunchVariables(this.templateApi, template);
        const surveyVariables = await this.getSurveyArguments(this.templateApi, template);
        return  {
            ...template.ask_inventory_on_launch ? { inventory: buildFunctionArgument("integer", undefined, template.inventory, INVENTORY_DESC)} : undefined,
            ...template.ask_limit_on_launch ? { limit: buildFunctionArgument("string", undefined, template.limit, LIMIT_DESC)} : undefined,
            ...template.ask_scm_branch_on_launch ? { scm_branch: buildFunctionArgument("string", undefined, template.scm_branch, BRANCH_DESC)} : undefined,
            ...template.ask_tags_on_launch ? { job_tags: buildFunctionArgument("string", undefined, template.job_tags, JOB_TAGS_DESC)} : undefined,
            ...template.ask_skip_tags_on_launch ? { skip_tags: buildFunctionArgument("string", undefined, template.skip_tags, SKIP_TAGS_DESC)} : undefined,
            ...launchVariables,
            ...surveyVariables
        };
    }
};

class Factory {
    constructor() {
        this.jobTemplateBuilder = new JobTemplateArgumentBuilder();
        this.workflowJobTemplateBuilder = new WorkflowJobTemplateArgumentBuilder();
    }

    getBuilder(templateType) {
        if(templateType === JOB_TEMPLATE) {
            return this.jobTemplateBuilder;
        }

        if(templateType === WORKFLOW_JOB_TEMPLATE) {
            return this.workflowJobTemplateBuilder;
        }

        throw new Error(`Unsupported template type ${templateType}`)
    }
};

// eslint-disable-next-line import/prefer-default-export
export const ArgumentsBuilderFactory = new Factory();
