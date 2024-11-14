import { ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class TeamdeckApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    properties: INodeProperties[];
}