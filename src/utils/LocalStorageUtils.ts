export const JwtInLocalStorage = (jwt: string): boolean => {
    return window.localStorage.getItem("token") !== null && window.localStorage.getItem("token") === jwt;
}

export const hasAJwtInLocalStorage = (): boolean => {    
    return window.localStorage.getItem("token") !== null;
}

export const getJwtInLocalStorage = (): string => {
    return window.localStorage.getItem("token")!;
}

export const setJwtInLocalStorage = (jwt: string) => {
    window.localStorage.setItem("token", jwt);
}

export const removeJwtInLocalStorage = () => {
    window.localStorage.removeItem("token");
}