export const JOB_TEMPLATE = "job_template";
export const WORKFLOW_JOB_TEMPLATE = "workflow_job_template"

export const INVENTORY_DESC="Select the inventory containing the hosts you want this job to manage.";
export const LIMIT_DESC="Provide a host pattern to further constrain the list of hosts that will be managed or affected by the playbook. Multiple patterns are allowed. Refer to Ansible documentation for more information and examples on patterns.";
export const BRANCH_DESC="Select a branch for the workflow. This branch is applied to all job template nodes that prompt for a branch.";
export const JOB_TAGS_DESC="Tags are useful when you have a large playbook, and you want to run a specific part of a play or task. Use commas to separate multiple tags. Refer to the documentation for details on the usage of tags.";
export const SKIP_TAGS_DESC="Skip tags are useful when you have a large playbook, and you want to skip specific parts of a play or task. Use commas to separate multiple tags. Refer to the documentation for details on the usage of tags.";
export const JOB_TYPE_DESC="For job templates, select run to execute the playbook. Select check to only check playbook syntax, test environment setup, and report problems without executing the playbook.";
export const EXEC_ENV_DESC="The container image to be used for execution.";
export const CREDENTIALS_DESC="Select credentials for accessing the nodes this job will be ran against. You can only select one credential of each type. For machine credentials (SSH), checking \"Prompt on launch\" without selecting credentials will require you to select a machine credential at run time. If you select credentials and check \"Prompt on launch\", the selected credential(s) become the defaults that can be updated at run time.";
export const FORKS_DESC="The number of parallel or simultaneous processes to use while executing the playbook. An empty value, or a value less than 1 will use the Ansible default which is usually 5. The default number of forks can be overwritten with a change to *ansible.cfg*. Refer to the Ansible documentation for details about the configuration file."
export const VERBOSITY_DESC="Control the level of output ansible will produce as the playbook executes.";
export const JOB_SLICE_DESC="Divide the work done by this job template into the specified number of job slices, each running the same tasks against a portion of the inventory.";
export const TIMEOUT_DESC="The amount of time (in seconds) to run before the job is canceled. Defaults to 0 for no job timeout.";
export const SHOW_DIFF_DESC="If enabled, show the changes made by Ansible tasks, where supported. This is equivalent to Ansible's --diff mode.";