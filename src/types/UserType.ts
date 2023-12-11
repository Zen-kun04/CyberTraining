import { Dispatch, SetStateAction } from "react"

export type UserContextType = {
    user: UserInformationType | null,
    setUser: Dispatch<SetStateAction<UserInformationType | null>>
}

export type UserTypeRequest = {
    code: number,
    result: UserType,
}

export type UserType = {
    id: string,
    username: string,
    email: string,
    rank_id: string,
    level: number,
    created_at: string,
    updated_at: string,
}

export type UserInformationType = {
    id: string,
    username: string,
    email: string,
    rank_id: string,
    active: boolean,
    level: number,
    avatar: string,
    created_at: string,
    updated_at: string,
}

export type UserInformationTypeRequest = {
    code: number,
    result: UserInformationType,
}


export type UserUpdateType = {
    id?: string,
    username: string,
    email: string,
    rank: string,
    active?: boolean,
    avatar?: string,
}