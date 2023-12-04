export type FormAttributes = {
    value: string,
    length: number
}

export type FormRegisterType = {
    floating_email: FormAttributes,
    floating_username: FormAttributes,
    floating_password: FormAttributes,
    floating_repeat_password: FormAttributes,
}