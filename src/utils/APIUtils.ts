import { UserInformationType, UserType, UserTypeRequest, UserUpdateType } from "@/types/UserType"
import { getJwtInLocalStorage } from "./LocalStorageUtils"
import { RankType } from "@/types/RankType";
import { ChallengeCarouselType, ChallengeResponseType, ChallengeType } from "@/types/ChallengeType";
import { QuizResponseType, QuizType } from "@/types/QuizType";
import { CategoryResponseType, CategoryType } from "@/types/CategoryType";

export const getAllUsers = () => {
    return new Promise<UserTypeRequest>(async (resolve, reject) => {
        const request = await fetch("http://127.0.0.1/api/list/user", {
            method: "GET",
            headers: {
                Authorization: getJwtInLocalStorage()
            }
        });

        const response = await request.json();
        
        resolve(response);
    });
}

export const deleteUser = (id: string): Promise<boolean> => {
    return new Promise<boolean>(async (resolve, reject) => {
        const request = await fetch(`http://127.0.0.1/api/user/delete/${id}`, {
            method: "GET",
            headers: {
                Authorization: getJwtInLocalStorage()
            }
        });

        const response = await request.json();

        resolve(response.code === 200);
    });
}

export const userIdExist = (id: string) => {
    return new Promise<boolean>(async (resolve, reject) => {
        
        const request = await fetch(`http://127.0.0.1/api/user/${id}`, {
            method: "GET",
            headers: {
                Authorization: getJwtInLocalStorage()
            }
        });

        const response = await request.json();

        resolve(response.code === 200);
    });
}

export const challengeIdExist = (id: string) => {
    return new Promise<boolean>(async (resolve, reject) => {
        
        const request = await fetch(`http://127.0.0.1/api/challenge/${id}`, {
            method: "GET",
            headers: {
                Authorization: getJwtInLocalStorage()
            }
        });

        const response = await request.json();

        resolve(response.code === 200);
    });
}

export const rankIdExist = (id: string) => {
    return new Promise<boolean>(async (resolve, reject) => {
        
        const request = await fetch(`http://127.0.0.1/api/rank/${id}`, {
            method: "GET",
            headers: {
                Authorization: getJwtInLocalStorage()
            }
        });

        const response = await request.json();

        resolve(response.code === 200);
    });
}

export const getUserById = (id: string) => {
    return new Promise<UserInformationType>(async (resolve, reject) => {
        
        const request = await fetch(`http://127.0.0.1/api/user/${id}`, {
            method: "GET",
            headers: {
                Authorization: getJwtInLocalStorage()
            }
        });

        const response = await request.json();

        resolve(response.result);
    });
}

export const getChallengeById = (id: string) => {
    return new Promise<ChallengeType>(async (resolve, reject) => {
        
        const request = await fetch(`http://127.0.0.1/api/challenge/${id}`, {
            method: "GET",
            headers: {
                Authorization: getJwtInLocalStorage()
            }
        });

        const response = await request.json();

        resolve(response.result);
    });
}

export const getRankById = (rank_id: string): Promise<RankType> => {
    return new Promise<RankType>(async (resolve, reject) => {
        const request = await fetch(`http://127.0.0.1/api/rank/${rank_id}`, {
            headers: {
                Authorization: getJwtInLocalStorage()
            }
        });

        const response = await request.json();
        
        console.log(response);
        
        resolve(response.result);
    });
}

export const getAllRanks = (): Promise<RankType[]> => {
    return new Promise<RankType[]>(async (resolve, reject) => {
        const request = await fetch(`http://127.0.0.1/api/list/rank`, {
            method: "GET",
            headers: {
                Authorization: getJwtInLocalStorage()
            }
        });

        const response = await request.json();
        console.log(response);
        
        resolve(response.result);
    })
}

export const updateUser = async (user: UserUpdateType, token: string) => {
    await fetch(`http://127.0.0.1/api/update/user`, {
        method: "PATCH",
        body: JSON.stringify(user),
        headers: {
            Authorization: token,
            "Content-Type": "application/json"
        }
    });   
}

export const updateRank = async (user: RankType, token: string) => {
    await fetch(`http://127.0.0.1/api/rank`, {
        method: "PATCH",
        body: JSON.stringify(user),
        headers: {
            Authorization: token,
            "Content-Type": "application/json"
        }
    });   
}

export const getAllChallenges = (): Promise<ChallengeType[]> => {
    return new Promise<ChallengeType[]>(async (resolve, reject) => {
        const request = await fetch("http://127.0.0.1/api/list/challenge", {
            headers: {
                Authorization: getJwtInLocalStorage()
            }
        });
        const response: ChallengeResponseType = await request.json();
        if (response.code === 200) {
            resolve(response.result);
        }else {
            resolve([]);
        }
        
    })
}

export const getAllQuiz = (): Promise<QuizType[]> => {
    return new Promise<QuizType[]>(async (resolve, reject) => {
        const request = await fetch("http://127.0.0.1/api/list/quiz");
        const response: QuizResponseType = await request.json();
        if (response.code === 200) {
            resolve(response.result);
        }else {
            resolve([]);
        }
    })
}

export const createRank = async (rankName: string, rankAdmin: boolean) => {
    await fetch("http://127.0.0.1/api/new-rank", {
        method: "POST",
        headers: {
            Authorization: getJwtInLocalStorage(),
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: rankName,
            admin: rankAdmin,
        }),
    });
}

export const deleteRank = async (rank_id: string) => {
    await fetch("http://127.0.0.1/api/delete/rank", {
        method: "POST",
        headers: {
            Authorization: getJwtInLocalStorage(),
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: rank_id,
        }),
    });
}

export const deleteCategory = async (category_id: string) => {
    await fetch("http://127.0.0.1/api/delete/category", {
        method: "POST",
        headers: {
            Authorization: getJwtInLocalStorage(),
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: category_id,
        }),
    });
}

export const createCategory = async (category_name: string) => {
    await fetch("http://127.0.0.1/api/new/category", {
        method: "POST",
        headers: {
            Authorization: getJwtInLocalStorage(),
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: category_name,
        }),
    });
}

export const getAllCategories = (): Promise<CategoryType[]> => {
    return new Promise<CategoryType[]>(async (resolve, reject) => {
        const request = await fetch(`http://127.0.0.1/api/list/category`, {
            method: "GET",
            headers: {
                Authorization: getJwtInLocalStorage()
            }
        });

        const response = await request.json();
        console.log(response);
        
        resolve(response.result);
    })
}

export const categoryIdExist = (id: string) => {
    return new Promise<boolean>(async (resolve, reject) => {
        
        const request = await fetch(`http://127.0.0.1/api/category/${id}`, {
            method: "GET",
            headers: {
                Authorization: getJwtInLocalStorage()
            }
        });

        const response = await request.json();

        resolve(response.code === 200);
    });
}

export const getCategoryById = (category_id: string): Promise<RankType> => {
    return new Promise<RankType>(async (resolve, reject) => {
        const request = await fetch(`http://127.0.0.1/api/category/${category_id}`, {
            method: "GET",
            headers: {
                Authorization: getJwtInLocalStorage()
            }
        });

        const response = await request.json();
        console.log(response);
        
        resolve(response.result);
    });
}