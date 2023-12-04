import { UserType } from "@/types/UserType";

const jwt = require("jsonwebtoken");

export const isJwtValid = (token: string): boolean => {
    const passphrase = process.env.JWT_PASSPHRASE;
    return jwt.verify(token, passphrase);
}

export const getUserInformationByJwt = (token: string): Promise<UserType | null> => {
    return new Promise<UserType | null>(async (resolve, reject) => {
        const request = await fetch("http://127.0.0.1/api/jwt/decode", {
            method: "GET",
            headers: {
                Authorization: token
            }
        });

        const response = await request.json();
        if(response.code === 200){
            resolve(response.result)
        }else {
            resolve(null)
        }
        
    });
}