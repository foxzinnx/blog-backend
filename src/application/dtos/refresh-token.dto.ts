export interface RefreshSessionInput {
    refreshToken: string;
}

export interface RefreshSessionOutput {
    accessToken: string;
    refreshToken: string;
}

export interface LogoutInput {
    refreshToken: string;
}