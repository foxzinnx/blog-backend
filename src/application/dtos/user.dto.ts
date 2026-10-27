export interface CreateUserInputDTO {
    name: string;
    email: string;
    password: string;
    slug: string;
}

export interface AuthenticateUserInputDTO {
    email: string;
    password: string;
}

export interface UpdateUserInputDTO {
    name?: string;
    email?: string;
    slug?: string;
    bio?: string;
}

export interface UserOutputDTO {
    id: string;
    name: string;
    email: string;
    slug: string;
    bio: string | null;
    createdAt: Date;
    updatedAt: Date;
}