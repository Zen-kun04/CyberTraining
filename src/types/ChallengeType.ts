export type ChallengeType = {
    id: string,
    title: string,
    description: string,
    exploit: string,
    image: string | null,
}

export type ChallengeCarouselType = {
    id: string,
    title: string,
    image: string | null,
}

export type ChallengeResponseType = {
    code: number,
    result: ChallengeType[]
}