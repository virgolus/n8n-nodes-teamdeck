import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TeamdeckApi implements ICredentialType {
	name = 'teamdeckApi';
	displayName = 'Teamdeck API';
	documentationUrl = 'https://help.teamdeck.io/en/articles/4403393-teamdeck-api';
	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			default: '',
			required: true,
		},
	];
}
