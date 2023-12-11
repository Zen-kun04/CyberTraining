import DangerAlertComponent from "@/components/DangerAlertComponent";
import { RankType } from "@/types/RankType";
import { UserInformationType } from "@/types/UserType";
import { getAllRanks, getUserById, updateUser, userIdExist } from "@/utils/APIUtils";
import { getJwtInLocalStorage } from "@/utils/LocalStorageUtils";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const EditUser = () => {
    const router = useRouter();
    const { id } = router.query as { id: string };
    const [loaded, setLoaded] = useState<boolean>(false);
    const [userInformation, setUserInformation] = useState<UserInformationType | null>(null);
    const [ranks, setRanks] = useState<RankType[]>([]);

    useEffect(() => {
        if (id) {
            userIdExist(id).then((result) => {
                if (result) {
                    getUserById(id).then((user_result) => {
                        setUserInformation(user_result);
                        getAllRanks().then((result) => {                            
                            const currentUserRank = result.find(rank => rank.id === user_result.rank_id);
                            const uniqueRanks = result.filter((rank, index, self) =>
                                self.findIndex(r => r.id === rank.id) === index && rank.id !== currentUserRank?.id
                            );

                            const finalRanks = [currentUserRank, ...uniqueRanks];
                            console.log(finalRanks);
                            
                            setRanks(finalRanks as RankType[]);
                            setLoaded(true);
                        })
                    })


                } else {
                    router.push('/admin/users')
                }
            })
        }

    }, [id])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInformation(previous => ({
            ...previous,
            [event.target.id]: event.target.value || ''
        }))
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const current = event.currentTarget;
        const new_user_information = {
            id: userInformation?.id,
            email: (current[2] as HTMLInputElement).value,
            username: (current[1] as HTMLInputElement).value,
            rank: (current[3] as HTMLInputElement).value,
            avatar: userInformation?.avatar,
            active: userInformation?.active,
        }
        // const role_id = event.currentTarget["3"].children
        // console.log(user_id, username, email, role_id);
        
        updateUser(new_user_information, getJwtInLocalStorage()).then(() => {
            router.push('/admin/users');
        })
        
        
        
    }

    return (
        loaded && userInformation && (
            <main>
                <div className="block ml-auto mr-auto max-w-2xl mt-20">
                    <h1 className="mb-20 text-center text-xl">{userInformation.email}</h1>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className="relative z-0 max-w-xl mb-6 group">
                            <label htmlFor="uuid" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Unique ID:</label>
                            <input type="text" id="uuid" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={userInformation.id} disabled readOnly />
                        </div>
                        <div className="relative z-0 max-w-xl mb-6 group">
                            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username:</label>
                            <input onChange={(e) => handleChange(e)} type="text" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={userInformation.username} required />
                        </div>

                        <div className="relative z-0 max-w-xl mb-6 group">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email:</label>
                            <input onChange={(e) => handleChange(e)} type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={userInformation.email} required />
                        </div>

                        <div className="relative z-0 max-w-xl mb-6 group">
                            <label htmlFor="ranks" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rank:</label>
                            <select onChange={(a) => console.log(a.target.value)} id="ranks" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">

                                {

                                    ranks && (ranks.map((rank) => (
                                        <option value={rank.id}>{rank.name}</option>
                                    )))
                                }
                            </select>

                        </div>
                        <button type="submit" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ">
                            Update User
                        </button>

                        <DangerAlertComponent />
                        <div className="flex">
                            
                            <div className="relative mb-6 mr-5">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                                        <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                                        <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                                    </svg>
                                </div>
                                <input type="text" id="input-group-1" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" />

                            </div>
                            <button type="button" className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 text-center me-2 mb-2 h-11">
                                Account Lost/Hacked
                            </button>
                        </div>

                    </form>
                </div>

            </main>
        ))
}

export default EditUser;