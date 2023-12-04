export type QuizType = {
    id: string,
    name: string,
    image: string | null
}

export type QuizResponseType = {
    code: number,
    result: QuizType[],
}