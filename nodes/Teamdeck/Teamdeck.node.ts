import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	NodeApiError,
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
								'time-entries'
							],
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
			],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const errorData: INodeExecutionData[] = [];

		// Initialize item with a default value
		let item: INodeExecutionData = {
			json: {},
		};

		// Helper function for paginated calls
		async function getAllResults(
			self: IExecuteFunctions,
				endpoint: string,
				qs: IDataObject,
		) {
			const returnData: IDataObject[] = [];
			let responseData: IDataObject[] = [];
			
			const returnAll = self.getNodeParameter('returnAll', 0) as boolean;
			const limit = returnAll ? 0 : self.getNodeParameter('limit', 0) as number;
			
			qs.per_page = 100;
			qs.page = 1;
			
			try {
				do {
					const response = await self.helpers.requestWithAuthentication.call(self, 'teamdeckApi', {
							method: 'GET',
							url: `https://api.teamdeck.io/v1/${endpoint}`,
							qs,
							json: true,
							resolveWithFullResponse: true,
						});
						
						responseData = response.body;
						const totalPages = parseInt(response.headers['x-pagination-page-count'] || '1');
						
						if (Array.isArray(responseData)) {
							returnData.push(...responseData);
						}
						
						if (!returnAll && returnData.length >= limit) {
							returnData.length = limit;
							break;
						}
						
						if (qs.page >= totalPages) {
							break;
						}
						
						qs.page++;
						
					} while (true);
					
					return returnData;
				} catch (error) {
					throw error;
				}
			}

		try {
			for (let i = 0; i < items.length; i++) {
				try {
					const resource = this.getNodeParameter('resource', i) as string;
					const operation = this.getNodeParameter('operation', i) as string;
					let additionalJson: IDataObject = {};
					
					try {
						additionalJson = this.getNodeParameter('additionalJson', i) as IDataObject;
					} catch (e) {
						// If additionalJson is not provided, continue with empty object
					}

					if (resource === 'project') {
						if (operation === 'getAll') {
							const additionalFields = this.getNodeParameter('additionalFields', i, {});
							const qs: any = { ...additionalFields };
							const results = await getAllResults(this, 'projects', qs);
							results.forEach((result) => {
								returnData.push({
									json: {
										...result,
										additionalJson,
									},
								});
							});
							continue;
						}
						else if (operation === 'create') {
							const credentials = await this.getCredentials('teamdeckApi');
							const name = this.getNodeParameter('name', i) as string;
							const additionalFields = this.getNodeParameter('additionalFields', i, {});

							const response = await this.helpers.requestWithAuthentication.call(this, 'teamdeckApi', {
								method: 'POST',
								url: 'https://api.teamdeck.io/v1/projects',
								body: {
									name,
									...additionalFields,
								},
								headers: {
									'X-Api-Key': credentials.apiKey,
								},
								json: true,
							});

							item = {
								json: {
									...response.data || response,
									additionalJson,
								},
							};
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

							item = {
								json: {
									success: true,
									additionalJson,
								},
							};
						}
						else if (operation === 'get') {
							const credentials = await this.getCredentials('teamdeckApi');
							const projectId = this.getNodeParameter('project_id', i) as string;

							const response = await this.helpers.requestWithAuthentication.call(this, 'teamdeckApi', {
								method: 'GET',
								url: `https://api.teamdeck.io/v1/projects/${projectId}`,
								headers: {
									'X-Api-Key': credentials.apiKey,
								},
								json: true,
							});

							item = {
								json: {
									...response.data || response,
									additionalJson,
								},
							};
						}
						else if (operation === 'update') {
							const credentials = await this.getCredentials('teamdeckApi');
							const projectId = this.getNodeParameter('project_id', i) as string;
							const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

							if (Object.keys(updateFields).length === 0) {
								throw new NodeApiError(this.getNode(), { message: 'Please specify at least one field to update' }, { itemIndex: i });
							}

							const response = await this.helpers.requestWithAuthentication.call(this, 'teamdeckApi', {
								method: 'PUT',
								url: `https://api.teamdeck.io/v1/projects/${projectId}`,
								body: updateFields,
								headers: {
									'X-Api-Key': credentials.apiKey,
								},
								json: true,
							});

							item = {
								json: {
									...response.data || response,
									additionalJson,
								},
							};
						}
					}
					else if (resource === 'time-entries') {
						if (operation === 'getAll') {
							const filters = this.getNodeParameter('filters', i, {});
							const qs: any = {};
							
							if (filters.start_date) {
								qs.start_date_from = formatDate(filters.start_date.toString(), this);
							}
							if (filters.end_date) {
								qs.start_date_to = formatDate(filters.end_date.toString(), this);
							}
							if (filters.project_id) {
								qs.project_id = filters.project_id;
							}
							if (filters.resource_id) {
								qs.resource_id = filters.resource_id;
							}
							
							const results = await getAllResults(this, 'time-entries', qs);
							results.forEach((result) => {
								returnData.push({
									json: {
										...result,
										additionalJson,
									},
								});
							});
							continue;
						}
						else if (operation === 'create') {
							const credentials = await this.getCredentials('teamdeckApi');
							
							const body: IDataObject = {
								project_id: this.getNodeParameter('project_id', i) as string,
								resource_id: this.getNodeParameter('resource_id', i) as string,
							};
							
							const startDate = this.getNodeParameter('start_date', i) as string;
							if (!startDate) {
								throw new NodeApiError(this.getNode(), { message: 'Start date is required' }, { itemIndex: i });
							}
							body.start_date = formatDate(startDate, this);
							
							const endDate = this.getNodeParameter('end_date', i) as string;
							if (!endDate) {
								throw new NodeApiError(this.getNode(), { message: 'End date is required' }, { itemIndex: i });
							}
							body.end_date = formatDate(endDate, this);
							
							body.minutes = this.getNodeParameter('minutes', i) as number;
							body.description = this.getNodeParameter('description', i, '') as string;

							const response = await this.helpers.requestWithAuthentication.call(this, 'teamdeckApi', {
								method: 'POST',
								url: 'https://api.teamdeck.io/v1/time-entries',
								body,
								headers: {
									'X-Api-Key': credentials.apiKey,
								},
								json: true,
							});

							item = {
								json: {
									...response.data || response,
									additionalJson,
								},
							};
						}
						else if (operation === 'get') {
							const credentials = await this.getCredentials('teamdeckApi');
							const timeEntryId = this.getNodeParameter('timeEntryId', i) as string;

							const response = await this.helpers.requestWithAuthentication.call(this, 'teamdeckApi', {
								method: 'GET',
								url: `https://api.teamdeck.io/v1/time-entries/${timeEntryId}`,
								headers: {
									'X-Api-Key': credentials.apiKey,
								},
								json: true,
							});

							item = {
								json: {
									...response.data || response,
									additionalJson,
								},
							};
						}
						else if (operation === 'update') {
							const credentials = await this.getCredentials('teamdeckApi');
							const timeEntryId = this.getNodeParameter('timeEntryId', i) as string;
							const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

							if (Object.keys(updateFields).length === 0) {
								throw new NodeApiError(this.getNode(), { message: 'Please specify at least one field to update' }, { itemIndex: i });
							}

							// Format dates if they exist in updateFields
							if (updateFields.start_date) {
								updateFields.start_date = formatDate(updateFields.start_date as string, this);
							}
							if (updateFields.end_date) {
								updateFields.end_date = formatDate(updateFields.end_date as string, this);
							}

							const response = await this.helpers.requestWithAuthentication.call(this, 'teamdeckApi', {
								method: 'PUT',
								url: `https://api.teamdeck.io/v1/time-entries/${timeEntryId}`,
								body: updateFields,
								headers: {
									'X-Api-Key': credentials.apiKey,
								},
								json: true,
							});

							item = {
								json: {
									...response.data || response,
									additionalJson,
								},
							};
						}
						else if (operation === 'delete') {
							const credentials = await this.getCredentials('teamdeckApi');
							const timeEntryId = this.getNodeParameter('timeEntryId', i) as string;
							
							await this.helpers.requestWithAuthentication.call(this, 'teamdeckApi', {
								method: 'DELETE',
								url: `https://api.teamdeck.io/v1/time-entries/${timeEntryId}`,
								headers: {
									'X-Api-Key': credentials.apiKey,
								},
							});

							item = {
								json: {
									success: true,
									additionalJson,
								},
							};
						}
					}

					// Verifica il risultato prima di aggiungerlo a returnData
					if (item && item.json && !Object.values(item.json).every(v => v === undefined)) {
						returnData.push(item);
					} else {
						throw new NodeApiError(
							this.getNode(),
							{ message: 'Invalid API response received' },
							{ itemIndex: i }
						);
					}

				} catch (error) {
					if (this.continueOnFail()) {
						const errorItem = {
							json: {
								error: error.message,
								details: error.description || error.response?.body?.message || 
										'The resource you are requesting could not be found',
								statusCode: error.response?.statusCode,
								itemIndex: i,
								timestamp: new Date().toISOString(),
								// Includi anche i dati originali dell'item che ha causato l'errore
								originalItem: items[i].json,
							},
						};
						errorData.push(errorItem);
						continue;
					}
					throw error;
				}
			}
			
			// Se ci sono errori e continueOnFail è attivo, restituisci entrambi i branch
			if (errorData.length > 0) {
				return [returnData, errorData];
			}
			
			// Altrimenti restituisci solo il branch di successo
			return [returnData];

		} catch (error) {
			if (this.continueOnFail()) {
				// In caso di errore globale, includi informazioni dettagliate
				const errorItem = {
					json: {
						error: error.message,
						details: error.description || error.response?.body?.message || 
								'The resource you are requesting could not be found',
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