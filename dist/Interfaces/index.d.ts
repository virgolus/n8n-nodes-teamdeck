export interface ITeamdeckProject {
    id: string;
    name: string;
    description?: string;
    color?: string;
    archived?: boolean;
    created_at: string;
    updated_at: string;
}
export interface ITeamdeckTimeEntry {
    id: string;
    project_id: string;
    user_id: string;
    start_date: string;
    duration: number;
    description?: string;
    billable?: boolean;
    created_at: string;
    updated_at: string;
}
export interface ITeamdeckPaginatedResponse<T> {
    data: T[];
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}
export interface ITeamdeckApiError {
    message: string;
    errors?: {
        [key: string]: string[];
    };
}
