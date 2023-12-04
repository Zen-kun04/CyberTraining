import { getJwtInLocalStorage, hasAJwtInLocalStorage, removeJwtInLocalStorage } from "./LocalStorageUtils"

export const isAuthentified = () => {
    return new Promise<boolean>(async (resolve, reject) => {
        if (hasAJwtInLocalStorage()) {
            const token = getJwtInLocalStorage();
            const request = await fetch("http://127.0.0.1/api/session", {
                method: "GET",
                headers: {
                    Authorization: token
                }
            });
            const response = await request.json();
            if (response.code === 200) {
                resolve(true);
            }else {
                removeJwtInLocalStorage();
                resolve(false);
            }
        }else {
            resolve(false);
        }
    })
    
}

export const isAdministrator = () => {
    return new Promise<boolean>(async (resolve, reject) => {
        if (hasAJwtInLocalStorage()) {
            const token = getJwtInLocalStorage();
            const request = await fetch("http://127.0.0.1/api/admin", {
                method: "GET",
                headers: {
                    Authorization: token
                }
            });
            const response = await request.json();
            
            resolve(response.code === 200);
        }else {
            resolve(false);
        }
    })
}