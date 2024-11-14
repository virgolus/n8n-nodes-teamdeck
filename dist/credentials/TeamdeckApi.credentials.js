"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamdeckApi = void 0;
class TeamdeckApi {
    constructor() {
        this.name = 'teamdeckApi';
        this.displayName = 'Teamdeck API';
        this.documentationUrl = 'https://help.teamdeck.io/en/articles/4403393-teamdeck-api';
        this.properties = [
            {
                displayName: 'API Token',
                name: 'apiToken',
                type: 'string',
                default: '',
                required: true,
            },
        ];
    }
}
exports.TeamdeckApi = TeamdeckApi;
//# sourceMappingURL=TeamdeckApi.credentials.js.map