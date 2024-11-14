import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
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
						name: 'Timesheet',
						value: 'timesheet',
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
						name: 'Get All',
						value: 'getAll',
						description: 'Get all projects',
						action: 'Get all projects',
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
						type: 'string',
						default: '#2196F3',
						description: 'Project color (hex code)',
					},
				],
			},
			// Timesheet Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'timesheet',
						],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a timesheet entry',
						action: 'Create a timesheet entry',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all timesheet entries',
						action: 'Get all timesheet entries',
					},
				],
				default: 'getAll',
			},
			// Timesheet Fields
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'timesheet',
						],
					},
				},
				default: '',
				description: 'ID of the project',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'timesheet',
						],
					},
				},
				default: '',
				description: 'ID of the user',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'timesheet',
						],
					},
				},
				default: '',
				description: 'Start date and time of the timesheet entry',
			},
			{
				displayName: 'Duration (Hours)',
				name: 'duration',
				type: 'number',
				typeOptions: {
					minValue: 0.25,
					maxValue: 24,
				},
				required: true,
				displayOptions: {
					show: {
						operation: [
							'create',
						],
						resource: [
							'timesheet',
						],
					},
				},
				default: 1,
				description: 'Duration in hours',
			},
			// Filter Fields for Timesheet GetAll
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
							'timesheet',
						],
					},
				},
				options: [
					{
						displayName: 'Start Date',
						name: 'startDate',
						type: 'dateTime',
						default: '',
						description: 'Filter by start date',
					},
					{
						displayName: 'End Date',
						name: 'endDate',
						type: 'dateTime',
						default: '',
						description: 'Filter by end date',
					},
					{
						displayName: 'Project ID',
						name: 'projectId',
						type: 'string',
						default: '',
						description: 'Filter by project ID',
					},
					{
						displayName: 'User ID',
						name: 'userId',
						type: 'string',
						default: '',
						description: 'Filter by user ID',
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
							'timesheet',
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
							'timesheet',
						],
						returnAll: [
							false,
						],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 50,
				description: 'Max number of results to return',
			}
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Funzione helper per gestire le chiamate paginate
		async function getAllResults(
			that: IExecuteFunctions,
			endpoint: string,
			qs: any = {},
		): Promise<any[]> {
			const returnAll = that.getNodeParameter('returnAll', 0) as boolean;
			const limit = returnAll ? -1 : (that.getNodeParameter('limit', 0) as number);
			let results: any[] = [];
			
			qs.per_page = 100; // Massimo numero di risultati per pagina
			qs.page = 1;

			try {
				do {
					const response = await that.helpers.requestWithAuthentication.call(that, 'teamdeckApi', {
						method: 'GET',
						url: `https://api.teamdeck.io/v1/${endpoint}`,
						qs,
						json: true,
						resolveWithFullResponse: true, // Per ottenere gli headers
					});

					const items = response.body.data || response.body;
					results.push.apply(results, items);

					// Controlla se ci sono altre pagine
					const totalPages = parseInt(response.headers['x-pagination-page-count'] || '1');
					const hasMore = qs.page < totalPages;

					// Se abbiamo raggiunto il limite o non ci sono più pagine, esci
					if (!returnAll && results.length >= limit) {
						results = results.slice(0, limit);
						break;
					}

					if (!hasMore) break;
					qs.page++;

				} while (true);

				return results;
			} catch (error) {
				throw new Error(`Teamdeck Error: ${error.message}`);
			}
		}

		if (resource === 'project') {
			if (operation === 'getAll') {
				const additionalFields = this.getNodeParameter('additionalFields', 0, {}) as {
					archived?: boolean;
					sort?: string;
					order?: string;
				};

				const qs: any = { ...additionalFields };
				
				const results = await getAllResults(this, 'projects', qs);
				returnData.push.apply(returnData, results.map(item => ({
					json: item,
				})));
			}
			else if (operation === 'create') {
				// ... (create project rimane lo stesso)
			}
		}
		else if (resource === 'timesheet') {
			if (operation === 'getAll') {
				const filters = this.getNodeParameter('filters', 0, {}) as {
					startDate?: string;
					endDate?: string;
					projectId?: string;
					userId?: string;
				};

				const qs: any = { ...filters };
				
				const results = await getAllResults(this, 'time_entries', qs);
				returnData.push.apply(returnData, results.map(item => ({
					json: item,
				})));
			}
			else if (operation === 'create') {
				// ... (create timesheet rimane lo stesso)
			}
		}

		return [returnData];
	}
}