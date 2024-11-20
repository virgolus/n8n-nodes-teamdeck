import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
	IDataObject,
} from 'n8n-workflow';

export class Teamdeck implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Teamdeck',
		name: 'teamdeck',
		icon: 'file:teamdeck.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Teamdeck API',
		defaults: {
			name: 'Teamdeck',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'teamdeckApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Project',
						value: 'project',
					},
					{
						name: 'Time-Entry',
						value: 'time-entries',
					},
				],
				default: 'project',
			},
			// Project Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'project',
						],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new project',
						action: 'Create a project',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a project',
						action: 'Delete a project',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a single project',
						action: 'Get a project',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many projects',
						action: 'Get many projects',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a project',
						action: 'Update a project',
					},
				],
				default: 'getAll',
			},
			// Project Fields
			{
				displayName: 'Project Name',
				name: 'name',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'project',
						],
					},
				},
				default: '',
				description: 'Name of the project to create',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: [
							'project',
						],
						operation: [
							'create',
						],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Project description',
					},
					{
						displayName: 'Color',
						name: 'color',
						type: 'color',
						default: '#2196F3',
						description: 'Project color (hex code)',
					},
				],
			},
			// time-entries Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'time-entries',
						],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a time-entry',
						action: 'Create a time entry',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a time-entry',
						action: 'Delete a time entry',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a single time-entry',
						action: 'Get a time entry',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many time-entries',
						action: 'Get many time entries',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a time-entry',
						action: 'Update a time entry',
					},
				],
				default: 'getAll',
			},
			// time-entries Fields
			{
				displayName: 'Project ID',
				name: 'project_id',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'time-entries',
						],
					},
				},
				default: '',
				description: 'ID of the project',
			},
			{
				displayName: 'Resource ID',
				name: 'resource_id',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'time-entries',
						],
					},
				},
				default: '',
				description: 'ID of the resource',
			},
			{
				displayName: 'Start Date',
				name: 'start_date',
				type: 'dateTime',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'time-entries',
						],
					},
				},
				default: '',
				description: 'Start date of the entry (format: YYYY-MM-DD)',
			},
			{
				displayName: 'End Date',
				name: 'end_date',
				type: 'dateTime',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'time-entries',
						],
					},
				},
				default: '',
				description: 'End date of the entry (format: YYYY-MM-DD)',
			},
			{
				displayName: 'Minutes',
				name: 'minutes',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'time-entries',
						],
					},
				},
				default: 60,
				description: 'Duration in minutes',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'time-entries',
						],
					},
				},
				default: '',
			},
			// Filter Fields for time-entries GetAll
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						operation: [
							'getAll',
						],
						resource: [
							'time-entries',
						],
					},
				},
				options: [
					{
						displayName: 'Start Date',
						name: 'start_date',
						type: 'dateTime',
						default: '',
						description: 'Filter by start date',
					},
					{
						displayName: 'End Date',
						name: 'end_date',
						type: 'dateTime',
						default: '',
						description: 'Filter by end date',
					},
					{
						displayName: 'Project ID',
						name: 'project_id',
						type: 'string',
						default: '',
						description: 'Filter by project ID',
					},
					{
						displayName: 'Resource ID',
						name: 'resource_id',
						type: 'string',
						default: '',
						description: 'Filter by resource ID',
					},
				],
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: [
							'getAll',
						],
						resource: [
							'project',
							'time-entries',
						],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						operation: [
							'getAll',
						],
						resource: [
							'project',
							'time-entries',
						],
						returnAll: [
							false,
						],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Time Entry ID',
				name: 'timeEntryId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['time-entries'],
						operation: ['delete', 'get', 'update'],
					},
				},
				default: '',
				description: 'ID of the time entry',
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['time-entries'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Project ID',
						name: 'project_id',
						type: 'string',
						default: '',
						description: 'ID of the project',
					},
					{
						displayName: 'Resource ID',
						name: 'resource_id',
						type: 'string',
						default: '',
						description: 'ID of the resource',
					},
					{
						displayName: 'Minutes',
						name: 'minutes',
						type: 'number',
						default: 0,
					},
					{
						displayName: 'End_date',
						name: 'end_date',
						type: 'dateTime',
						default: '',
						description: 'End date of the time entry (YYYY-MM-DD)',
					},
					{
						displayName: 'Start_date',
						name: 'start_date',
						type: 'dateTime',
						default: '',
						description: 'Start date of the time entry (YYYY-MM-DD)',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
					},
					// Aggiungi altri campi che possono essere aggiornati
				],
			},
			{
				displayName: 'Project ID',
				name: 'project_id',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['delete', 'get', 'update'],
					},
				},
				default: '',
				description: 'ID of the project',
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'New name of the project',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'New description of the project',
					},
					{
						displayName: 'Color',
						name: 'color',
						type: 'color',
						default: '#2196F3',
						description: 'New project color (hex code)',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// Helper function for paginated calls
		async function getAllResults(
			that: IExecuteFunctions,
			endpoint: string,
			qs: any = {},
			itemIndex: number,
		): Promise<any[]> {
			const credentials = await that.getCredentials('teamdeckApi');
			const returnAll = that.getNodeParameter('returnAll', itemIndex) as boolean;
			const limit = returnAll ? -1 : (that.getNodeParameter('limit', itemIndex) as number);
			let results: any[] = [];
			
			qs.per_page = 100;
			qs.page = 1;

			try {
				do {
					const response = await that.helpers.requestWithAuthentication.call(that, 'teamdeckApi', {
						method: 'GET',
						url: `https://api.teamdeck.io/v1/${endpoint}`,
						qs,
						headers: {
							'X-Api-Key': credentials.apiKey,
						},
						json: true,
						resolveWithFullResponse: true,
					});

					const items = response.body.data || response.body;
					results.push.apply(results, items);

					const totalPages = parseInt(response.headers['x-pagination-page-count'] || '1');
					const hasMore = qs.page < totalPages;

					if (!returnAll && results.length >= limit) {
						results = results.slice(0, limit);
						break;
					}

					if (!hasMore) break;
					qs.page++;

				} while (true);

				return results;
			} catch (error) {
				throw new NodeApiError(that.getNode(), error);
			}
		}

		// Process each input item
		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;

			if (resource === 'project') {
				if (operation === 'getAll') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as {
						archived?: boolean;
						sort?: string;
						order?: string;
					};

					const qs: any = { ...additionalFields };
					
					const results = await getAllResults(this, 'projects', qs, i);
					returnData.push.apply(returnData, results.map(item => ({
						json: item,
					})));
				}
				else if (operation === 'create') {
					const credentials = await this.getCredentials('teamdeckApi');
					const name = this.getNodeParameter('name', i) as string;
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as {
						description?: string;
						color?: string;
					};

					const body = {
						name,
						...additionalFields,
					};

					const response = await this.helpers.requestWithAuthentication.call(this, 'teamdeckApi', {
						method: 'POST',
						url: 'https://api.teamdeck.io/v1/projects',
						body,
						headers: {
							'X-Api-Key': credentials.apiKey,
						},
						json: true,
					});

					returnData.push({
						json: response.data || response,
					});
				}
				else if (operation === 'delete') {
					const credentials = await this.getCredentials('teamdeckApi');
					const project_id = this.getNodeParameter('project_id', i) as string;
					
					await this.helpers.requestWithAuthentication.call(this, 'teamdeckApi', {
						method: 'DELETE',
						url: `https://api.teamdeck.io/v1/projects/${project_id}`,
						headers: {
							'X-Api-Key': credentials.apiKey,
						},
					});

					returnData.push({ json: { success: true } });
				}
				else if (operation === 'get') {
					const credentials = await this.getCredentials('teamdeckApi');
					const project_id = this.getNodeParameter('project_id', i) as string;
					
					const response = await this.helpers.requestWithAuthentication.call(this, 'teamdeckApi', {
						method: 'GET',
						url: `https://api.teamdeck.io/v1/projects/${project_id}`,
						headers: {
							'X-Api-Key': credentials.apiKey,
						},
						json: true,
					});

					returnData.push({ json: response.data || response });
				}
				else if (operation === 'update') {
					const credentials = await this.getCredentials('teamdeckApi');
					const project_id = this.getNodeParameter('project_id', i) as string;
					const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
					
					const response = await this.helpers.requestWithAuthentication.call(this, 'teamdeckApi', {
						method: 'PUT',
						url: `https://api.teamdeck.io/v1/projects/${project_id}`,
						body: updateFields,
						headers: {
							'X-Api-Key': credentials.apiKey,
						},
						json: true,
					});

					returnData.push({ json: response.data || response });
				}
			}
			else if (resource === 'time-entries') {
				if (operation === 'getAll') {
					const filters = this.getNodeParameter('filters', i, {}) as {
						start_date?: string;
						end_date?: string;
						project_id?: string;
						resource_id?: string;
					};

					const qs: any = { ...filters };
					
					const results = await getAllResults(this, 'time-entries', qs, i);
					returnData.push.apply(returnData, results.map(item => ({
						json: item,
					})));
				}
				else if (operation === 'create') {
					const credentials = await this.getCredentials('teamdeckApi');
					
					const formatDate = (dateString: string): string => {
						return dateString.split(' ')[0];
					};
					
					const startDate = formatDate(this.getNodeParameter('start_date', i) as string);
					const endDate = formatDate(this.getNodeParameter('end_date', i) as string);
					
					const body = {
						project_id: this.getNodeParameter('project_id', i) as string,
						resource_id: this.getNodeParameter('resource_id', i) as string,
						start_date: startDate,
						end_date: endDate,
						minutes: this.getNodeParameter('minutes', i) as number,
						description: this.getNodeParameter('description', i, '') as string,
					};

					try {
						const response = await this.helpers.requestWithAuthentication.call(this, 'teamdeckApi', {
							method: 'POST',
							url: 'https://api.teamdeck.io/v1/time-entries',
							body,
							headers: {
								'X-Api-Key': credentials.apiKey,
							},
							json: true,
						});

						returnData.push({
							json: response.data || response,
						});
					} catch (error) {
						throw error;
					}
				}
				else if (operation === 'update') {
					const timeEntryId = this.getNodeParameter('timeEntryId', i) as string;
					const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
					
					const credentials = await this.getCredentials('teamdeckApi');
					const response = await this.helpers.requestWithAuthentication.call(this, 'teamdeckApi', {
						method: 'PUT',
						url: `https://api.teamdeck.io/v1/time-entries/${timeEntryId}`,
						body: updateFields,
						headers: {
							'X-Api-Key': credentials.apiKey,
						},
						json: true,
					});

					returnData.push({ json: response.data || response });
				}
				else if (operation === 'delete') {
					const timeEntryId = this.getNodeParameter('timeEntryId', i) as string;
					
					const credentials = await this.getCredentials('teamdeckApi');
					await this.helpers.requestWithAuthentication.call(this, 'teamdeckApi', {
						method: 'DELETE',
						url: `https://api.teamdeck.io/v1/time-entries/${timeEntryId}`,
						headers: {
							'X-Api-Key': credentials.apiKey,
						},
					});

					returnData.push({ json: { success: true } });
				}
			}
		}

		return [returnData];
	}
}