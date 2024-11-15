import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TeamdeckApi implements ICredentialType {
	name = 'teamdeckApi';
	displayName = 'Teamdeck API';
	documentationUrl = 'https://teamdeck.io/api-documentation';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Api-Key': '={{$credentials.apiKey}}'
			},
		},
	};
	
	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			url: 'https://api.teamdeck.io/v1/me',
			method: 'GET',
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					message: 'API credentials are valid',
					key: 'status',
					value: 200,
				},
			},
		],
	};
}