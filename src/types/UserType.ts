export type UserTypeRequest = {
    code: number,
    result: UserType[],
}

export type UserType = {
    id: string,
    username: string,
    email: string,
    rank: string,
    level: number,
    created_at: string,
    updated_at: string,
}

export type UserInformationType = {
    id?: string,
    username?: string,
    email?: string,
    rank?: string,
    active?: boolean,
    avatar?: string,
    created_at?: string,
    updated_at?: string,
}

export type UserUpdateType = {
    id?: string,
    username: string,
    email: string,
    rank: string,
    active?: boolean,
    avatar?: string,
}