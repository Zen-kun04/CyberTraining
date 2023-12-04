export type RankType = {
    id?: string,
    name?: string,
    admin?: boolean,
    created_at?: string,
    updated_at?: string,
}

export type RankResponseType = {
    code: number,
    result: RankType[]
}