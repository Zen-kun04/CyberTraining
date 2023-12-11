export type ChallengeType = {
    id?: string,
    title?: string,
    description?: string,
    category_id?: string,
    exploit?: string,
    image?: string | null,
    created_at?: string,
    updated_at?: string,
}

export type ChallengeCarouselType = {
    id: string,
    title: string,
    image: string | null,
}

export type ChallengeResponseType = {
    code: number,
    result: ChallengeType[],
}