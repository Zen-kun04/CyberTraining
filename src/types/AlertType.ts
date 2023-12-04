export enum AlertEnum {
    USER_DELETE,
    USER_EDIT,
    ACCOUNT_CREATE,
    ACCOUNT_LOGIN,
    RANK_CREATE,
    RANK_DELETE,
    CATEGORY_CREATE,
}

export type ComponentAlertType = {
    type: AlertEnum,
    message: string,
}