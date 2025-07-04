import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	NodeApiError,
	NodeConnectionType,
} from 'n8n-workflow';

function formatDate(dateString: string, self: IExecuteFunctions): string {
	let formattedDate: string;
	
	if (dateString.includes('T')) {
		// Format: YYYY-MM-ddTHH:mm:sssZ
		formattedDate = dateString.split('T')[0];
	} else {
		// Format: YYYY-MM-dd HH:mm:ss
		formattedDate = dateString.split(' ')[0];
	}
	
	return formattedDate;
}

export class Teamdeck implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Teamdeck',
		name: 'teamdeck',
		icon: 'file:teamdeck.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Teamdeck API for project management and time tracking',
		defaults: {
			name: 'Teamdeck',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		codex: {
			categories: ['Productivity', 'Project Management'],
			alias: ['teamdeck', 'time-tracking', 'project-management', 'time-entries', 'bookings', 'resource-scheduling'],
			subcategories: {
				'Project Management': ['Time Tracking', 'Project Operations', 'Bookings', 'Resource Scheduling'],
			},
		},
		credentials: [
			{
				name: 'teamdeckApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.teamdeck.io/v1',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Booking',
						value: 'bookings',
					},
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
			{
				displayName: 'Add Additional JSON',
				name: 'useAdditionalJson',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: [
							'project',
							'time-entries',
							'bookings'
						],
					},
				},
				description: 'Whether to add additional JSON data to pass through from input to output',
			},
			{
				displayName: 'Additional JSON',
				name: 'additionalJson',
				type: 'json',
				default: {},
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				displayOptions: {
					show: {
						resource: [
							'project',
							'time-entries',
							'bookings'
						],
						useAdditionalJson: [true],
					},
				},
				description: 'JSON data to pass through from input to output',
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
						action: 'Get a single project',
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
						default: '',
						description: 'Color of the project (hex code)',
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
				description: 'The unique identifier of the Teamdeck project (e.g., "12345")',
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
				description: 'Duration in minutes (e.g., 60 for 1 hour, 480 for 8 hours)',
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
				description: 'The ID of the project',
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
						description: 'Name of the project',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Description of the project',
					},
					{
						displayName: 'Color',
						name: 'color',
						type: 'color',
						default: '',
						description: 'Color of the project (hex code)',
					},
				],
			},
			// Booking Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'bookings',
						],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new booking',
						action: 'Create a booking',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a booking',
						action: 'Delete a booking',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a single booking',
						action: 'Get a booking',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many bookings',
						action: 'Get many bookings',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a booking',
						action: 'Update a booking',
					},
				],
				default: 'getAll',
			},
			// Booking Fields
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
							'bookings',
						],
					},
				},
				default: '',
				description: 'The unique identifier of the project for the booking',
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
							'bookings',
						],
					},
				},
				default: '',
				description: 'The unique identifier of the person/resource to book',
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
							'bookings',
						],
					},
				},
				default: '',
				description: 'Start date of the booking (format: YYYY-MM-DD)',
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
							'bookings',
						],
					},
				},
				default: '',
				description: 'End date of the booking (format: YYYY-MM-DD)',
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
							'bookings',
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
						description: 'Optional description for the booking',
					},
					{
						displayName: 'Time Fraction',
						name: 'time_fraction',
						type: 'number',
						default: 1,
						description: 'Time allocation as fraction (0.5 = 50%, 1 = 100%)',
						typeOptions: {
							minValue: 0,
							maxValue: 1,
						},
					},
				],
			},
			// Filter Fields for bookings GetAll
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
							'bookings',
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
				displayName: 'Booking ID',
				name: 'bookingId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['bookings'],
						operation: ['delete', 'get', 'update'],
					},
				},
				default: '',
				description: 'ID of the booking',
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['bookings'],
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
						displayName: 'Start Date',
						name: 'start_date',
						type: 'dateTime',
						default: '',
						description: 'Start date of the booking (YYYY-MM-DD)',
					},
					{
						displayName: 'End Date',
						name: 'end_date',
						type: 'dateTime',
						default: '',
						description: 'End date of the booking (YYYY-MM-DD)',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Description of the booking',
					},
					{
						displayName: 'Time Fraction',
						name: 'time_fraction',
						type: 'number',
						default: 1,
						description: 'Time allocation as fraction (0.5 = 50%, 1 = 100%)',
						typeOptions: {
							minValue: 0,
							maxValue: 1,
						},
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const errorData: INodeExecutionData[] = [];

		// Helper function for paginated API calls
		async function getAllResults(context: IExecuteFunctions, resource: string, qs: IDataObject = {}): Promise<IDataObject[]> {
			const credentials = await context.getCredentials('teamdeckApi');
			let results: IDataObject[] = [];
			let url: string;
			
			// Determine the correct endpoint
			if (resource === 'time-entries') {
				url = 'https://api.teamdeck.io/v1/time-entries';
			} else if (resource === 'bookings') {
				url = 'https://api.teamdeck.io/v1/bookings';
			} else if (resource === 'projects') {
				url = 'https://api.teamdeck.io/v1/projects';
			} else {
				url = `https://api.teamdeck.io/v1/${resource}`;
			}
			
			let hasMore = true;
			let page = 1;
			
			while (hasMore) {
				const requestOptions = {
					method: 'GET' as const,
					url,
					qs: { ...qs, page },
					headers: { 'X-Api-Key': credentials.apiKey },
					json: true,
				};
				
				const response = await context.helpers.requestWithAuthentication.call(context, 'teamdeckApi', requestOptions);
				const data = response.data || response;
				
				if (Array.isArray(data)) {
					results = results.concat(data);
					hasMore = data.length > 0;
				} else {
					results.push(data);
					hasMore = false;
				}
				
				page++;
				if (page > 100) break; // Safety check
			}
			
			return results;
		}

		// Process projects operations
		async function handleProject(context: IExecuteFunctions, operation: string, itemIndex: number, additionalJson: IDataObject): Promise<INodeExecutionData | INodeExecutionData[]> {
			const credentials = await context.getCredentials('teamdeckApi');
			const baseUrl = 'https://api.teamdeck.io/v1/projects';
			const headers = { 'X-Api-Key': credentials.apiKey };

			if (operation === 'getAll') {
				const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {});
				const results = await getAllResults(context, 'projects', additionalFields);
				return results.map((result: any) => ({ json: { ...result, additionalJson } }));
			}

			if (operation === 'create') {
				const name = context.getNodeParameter('name', itemIndex) as string;
				const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {});
				const response = await context.helpers.requestWithAuthentication.call(context, 'teamdeckApi', {
					method: 'POST', url: baseUrl, body: { name, ...additionalFields }, headers, json: true,
				});
				return { json: { ...response.data || response, additionalJson } };
			}

			if (operation === 'get') {
				const projectId = context.getNodeParameter('project_id', itemIndex) as string;
				const response = await context.helpers.requestWithAuthentication.call(context, 'teamdeckApi', {
					method: 'GET', url: `${baseUrl}/${projectId}`, headers, json: true,
				});
				return { json: { ...response.data || response, additionalJson } };
			}

			if (operation === 'update') {
				const projectId = context.getNodeParameter('project_id', itemIndex) as string;
				const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
				if (Object.keys(updateFields).length === 0) {
					throw new NodeApiError(context.getNode(), { message: 'Please specify at least one field to update' }, { itemIndex });
				}
				const response = await context.helpers.requestWithAuthentication.call(context, 'teamdeckApi', {
					method: 'PUT', url: `${baseUrl}/${projectId}`, body: updateFields, headers, json: true,
				});
				return { json: { ...response.data || response, additionalJson } };
			}

			if (operation === 'delete') {
				const projectId = context.getNodeParameter('project_id', itemIndex) as string;
				await context.helpers.requestWithAuthentication.call(context, 'teamdeckApi', {
					method: 'DELETE', url: `${baseUrl}/${projectId}`, headers,
				});
				return { json: { success: true, additionalJson } };
			}

			throw new NodeApiError(context.getNode(), { message: `Unknown operation: ${operation}` }, { itemIndex });
		}

		// Process time-entries operations  
		async function handleTimeEntries(context: IExecuteFunctions, operation: string, itemIndex: number, additionalJson: IDataObject): Promise<INodeExecutionData | INodeExecutionData[]> {
			const credentials = await context.getCredentials('teamdeckApi');
			const baseUrl = 'https://api.teamdeck.io/v1/time-entries';
			const headers = { 'X-Api-Key': credentials.apiKey };

			if (operation === 'getAll') {
				const filters = context.getNodeParameter('filters', itemIndex, {});
				const qs: any = {};
				if (filters.start_date) qs.start_date_from = formatDate(filters.start_date.toString(), context);
				if (filters.end_date) qs.start_date_to = formatDate(filters.end_date.toString(), context);
				if (filters.project_id) qs.project_id = filters.project_id;
				if (filters.resource_id) qs.resource_id = filters.resource_id;
				const results = await getAllResults(context, 'time-entries', qs);
				return results.map((result: any) => ({ json: { ...result, additionalJson } }));
			}

			if (operation === 'create') {
				const body: IDataObject = {
					project_id: context.getNodeParameter('project_id', itemIndex) as string,
					resource_id: context.getNodeParameter('resource_id', itemIndex) as string,
					minutes: context.getNodeParameter('minutes', itemIndex) as number,
					description: context.getNodeParameter('description', itemIndex, '') as string,
				};
				
				const startDate = context.getNodeParameter('start_date', itemIndex) as string;
				const endDate = context.getNodeParameter('end_date', itemIndex) as string;
				if (!startDate) throw new NodeApiError(context.getNode(), { message: 'Start date is required' }, { itemIndex });
				if (!endDate) throw new NodeApiError(context.getNode(), { message: 'End date is required' }, { itemIndex });
				
				body.start_date = formatDate(startDate, context);
				body.end_date = formatDate(endDate, context);

				const response = await context.helpers.requestWithAuthentication.call(context, 'teamdeckApi', {
					method: 'POST', url: baseUrl, body, headers, json: true,
				});
				return { json: { ...response.data || response, additionalJson } };
			}

			if (operation === 'get') {
				const timeEntryId = context.getNodeParameter('timeEntryId', itemIndex) as string;
				const response = await context.helpers.requestWithAuthentication.call(context, 'teamdeckApi', {
					method: 'GET', url: `${baseUrl}/${timeEntryId}`, headers, json: true,
				});
				return { json: { ...response.data || response, additionalJson } };
			}

			if (operation === 'update') {
				const timeEntryId = context.getNodeParameter('timeEntryId', itemIndex) as string;
				const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
				if (Object.keys(updateFields).length === 0) {
					throw new NodeApiError(context.getNode(), { message: 'Please specify at least one field to update' }, { itemIndex });
				}
				if (updateFields.start_date) updateFields.start_date = formatDate(updateFields.start_date as string, context);
				if (updateFields.end_date) updateFields.end_date = formatDate(updateFields.end_date as string, context);
				
				const response = await context.helpers.requestWithAuthentication.call(context, 'teamdeckApi', {
					method: 'PUT', url: `${baseUrl}/${timeEntryId}`, body: updateFields, headers, json: true,
				});
				return { json: { ...response.data || response, additionalJson } };
			}

			if (operation === 'delete') {
				const timeEntryId = context.getNodeParameter('timeEntryId', itemIndex) as string;
				await context.helpers.requestWithAuthentication.call(context, 'teamdeckApi', {
					method: 'DELETE', url: `${baseUrl}/${timeEntryId}`, headers,
				});
				return { json: { success: true, additionalJson } };
			}

			throw new NodeApiError(context.getNode(), { message: `Unknown operation: ${operation}` }, { itemIndex });
		}

		// Process bookings operations
		async function handleBookings(context: IExecuteFunctions, operation: string, itemIndex: number, additionalJson: IDataObject): Promise<INodeExecutionData | INodeExecutionData[]> {
			const credentials = await context.getCredentials('teamdeckApi');
			const baseUrl = 'https://api.teamdeck.io/v1/bookings';
			const headers = { 'X-Api-Key': credentials.apiKey };

			if (operation === 'getAll') {
				const filters = context.getNodeParameter('filters', itemIndex, {});
				const qs: any = {};
				if (filters.start_date) qs.start_date_from = formatDate(filters.start_date.toString(), context);
				if (filters.end_date) qs.start_date_to = formatDate(filters.end_date.toString(), context);
				if (filters.project_id) qs.project_id = filters.project_id;
				if (filters.resource_id) qs.resource_id = filters.resource_id;
				const results = await getAllResults(context, 'bookings', qs);
				return results.map((result: any) => ({ json: { ...result, additionalJson } }));
			}

			if (operation === 'create') {
				const body: IDataObject = {
					project_id: context.getNodeParameter('project_id', itemIndex) as string,
					resource_id: context.getNodeParameter('resource_id', itemIndex) as string,
				};
				
				const startDate = context.getNodeParameter('start_date', itemIndex) as string;
				const endDate = context.getNodeParameter('end_date', itemIndex) as string;
				if (!startDate) throw new NodeApiError(context.getNode(), { message: 'Start date is required' }, { itemIndex });
				if (!endDate) throw new NodeApiError(context.getNode(), { message: 'End date is required' }, { itemIndex });
				
				body.start_date = formatDate(startDate, context);
				body.end_date = formatDate(endDate, context);
				
				const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {});
				body.description = additionalFields.description || '';
				body.time_fraction = additionalFields.time_fraction || 1;

				const response = await context.helpers.requestWithAuthentication.call(context, 'teamdeckApi', {
					method: 'POST', url: baseUrl, body, headers, json: true,
				});
				return { json: { ...response.data || response, additionalJson } };
			}

			if (operation === 'get') {
				const bookingId = context.getNodeParameter('bookingId', itemIndex) as string;
				const response = await context.helpers.requestWithAuthentication.call(context, 'teamdeckApi', {
					method: 'GET', url: `${baseUrl}/${bookingId}`, headers, json: true,
				});
				return { json: { ...response.data || response, additionalJson } };
			}

			if (operation === 'update') {
				const bookingId = context.getNodeParameter('bookingId', itemIndex) as string;
				const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
				if (Object.keys(updateFields).length === 0) {
					throw new NodeApiError(context.getNode(), { message: 'Please specify at least one field to update' }, { itemIndex });
				}
				if (updateFields.start_date) updateFields.start_date = formatDate(updateFields.start_date as string, context);
				if (updateFields.end_date) updateFields.end_date = formatDate(updateFields.end_date as string, context);

				const response = await context.helpers.requestWithAuthentication.call(context, 'teamdeckApi', {
					method: 'PUT', url: `${baseUrl}/${bookingId}`, body: updateFields, headers, json: true,
				});
				return { json: { ...response.data || response, additionalJson } };
			}

			if (operation === 'delete') {
				const bookingId = context.getNodeParameter('bookingId', itemIndex) as string;
				await context.helpers.requestWithAuthentication.call(context, 'teamdeckApi', {
					method: 'DELETE', url: `${baseUrl}/${bookingId}`, headers,
				});
				return { json: { success: true, additionalJson } };
			}

			throw new NodeApiError(context.getNode(), { message: `Unknown operation: ${operation}` }, { itemIndex });
		}

		// Main execution loop - clean and readable
		try {
			for (let i = 0; i < items.length; i++) {
				try {
					const resource = this.getNodeParameter('resource', i) as string;
					const operation = this.getNodeParameter('operation', i) as string;
					let additionalJson: IDataObject = {};
					
					// Check if additional JSON is enabled and get the data
					const useAdditionalJson = this.getNodeParameter('useAdditionalJson', i, false) as boolean;
					if (useAdditionalJson) {
						try {
							additionalJson = this.getNodeParameter('additionalJson', i) as IDataObject;
						} catch (e) {
							// If additionalJson is not provided, continue with empty object
						}
					}

					let result: INodeExecutionData | INodeExecutionData[];

					// Route to appropriate handler based on resource
					switch (resource) {
						case 'project':
							result = await handleProject(this, operation, i, additionalJson);
							break;
						case 'time-entries':
							result = await handleTimeEntries(this, operation, i, additionalJson);
							break;
						case 'bookings':
							result = await handleBookings(this, operation, i, additionalJson);
							break;
						default:
							throw new NodeApiError(this.getNode(), { message: `Unknown resource: ${resource}` }, { itemIndex: i });
					}

					// Handle both single results and arrays (from getAll operations)
					if (Array.isArray(result)) {
						result.forEach((item: INodeExecutionData) => returnData.push(item));
					} else {
						if (result && result.json && !Object.values(result.json).every(v => v === undefined)) {
							returnData.push(result);
						} else {
							throw new NodeApiError(this.getNode(), { message: 'Invalid API response received' }, { itemIndex: i });
						}
					}

				} catch (error) {
					if (this.continueOnFail()) {
						const errorItem = {
							json: {
								error: error.message,
								details: error.description || error.response?.body?.message || 'The resource you are requesting could not be found',
								statusCode: error.response?.statusCode,
								itemIndex: i,
								timestamp: new Date().toISOString(),
								originalItem: items[i].json,
							},
						};
						errorData.push(errorItem);
						continue;
					}
					throw error;
				}
			}
			
			// Return results with proper error handling
			if (errorData.length > 0) {
				return [returnData, errorData];
			}
			return [returnData];

		} catch (error) {
			if (this.continueOnFail()) {
				const errorItem = {
					json: {
						error: error.message,
						details: error.description || error.response?.body?.message || 'The resource you are requesting could not be found',
						statusCode: error.response?.statusCode,
						timestamp: new Date().toISOString(),
					},
				};
				return [[], [errorItem]];
			}
			throw error;
		}
	}
}