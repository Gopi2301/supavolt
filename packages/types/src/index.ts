export interface User {
    id: string;
    email: string;
    name: string;
    avatarUrl: string;
    createdAt: string;
    updatedAt: string;
}

export type OrgRole = 'admin' | 'developer'

export interface Organization {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string
}

export interface OrgMember {
    id: string;
    orgId: string;
    user: string;
    role: OrgRole;
    joinedAt: string;
}

export interface Project {
    id: string;
    orgId: string;
    name: string;
    slug: string;
    dbSchema: string;
    projectUrl: string;
    anonKey: string;
    createdAt: string;
    updatedAt: string
}

export interface RegisterInput {
    email: string;
    password: string;
    name: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface JwtPayload {
    sub: string;
    email: string;
}