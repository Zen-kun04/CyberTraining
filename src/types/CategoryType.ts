export type CategoryType = {
    id?: string,
    name?: string,
    created_at?: string,
    updated_at?: string,
}

export type CategoryResponseType = {
    code: number,
    result: CategoryType[]
}