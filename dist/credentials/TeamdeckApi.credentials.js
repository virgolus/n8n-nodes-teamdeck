"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamdeckApi = void 0;
class TeamdeckApi {
    constructor() {
        this.name = 'teamdeckApi';
        this.displayName = 'Teamdeck API';
        this.documentationUrl = 'https://teamdeck.io/api-documentation';
        this.properties = [
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
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    'X-Api-Key': '={{$credentials.apiKey}}'
                },
            },
        };
        this.test = {
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
}
exports.TeamdeckApi = TeamdeckApi;
//# sourceMappingURL=TeamdeckApi.credentials.js.map