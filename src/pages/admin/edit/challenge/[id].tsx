import DangerAlertComponent from "@/components/DangerAlertComponent";
import { CategoryType } from "@/types/CategoryType";
import { ChallengeType } from "@/types/ChallengeType";
import { RankType } from "@/types/RankType";
import { UserInformationType } from "@/types/UserType";
import { challengeIdExist, getAllCategories, getAllRanks, getChallengeById, getUserById, updateUser, userIdExist } from "@/utils/APIUtils";
import { getJwtInLocalStorage } from "@/utils/LocalStorageUtils";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const EditUser = () => {
    const router = useRouter();
    const { id } = router.query as { id: string };
    const [loaded, setLoaded] = useState<boolean>(false);
    const [challengeInformation, setChallengeInformation] = useState<ChallengeType | null>(null);
    const [categories, setCategories] = useState<RankType[]>([]);

    useEffect(() => {
        if (id) {
            challengeIdExist(id).then((result) => {
                if (result) {
                    getChallengeById(id).then((challenge_result) => {
                        setChallengeInformation(challenge_result);
                        getAllCategories().then((result) => {                            
                            const currentChallengeCategory = result.find(category => category.id === challenge_result.category_id);
                            const uniqueCategories = result.filter((category, index, self) =>
                                self.findIndex(r => r.id === category.id) === index && category.id !== currentChallengeCategory?.id
                            );

                            const finalCategories = [currentChallengeCategory, ...uniqueCategories];
                            
                            setCategories(finalCategories as CategoryType[]);
                            setLoaded(true);
                        })
                    })


                } else {
                    router.push('/admin/challenges')
                }
            })
        }

    }, [id])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChallengeInformation(previous => ({
            ...previous,
            [event.target.id]: event.target.value || ''
        }))
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const current = event.currentTarget;
        const new_challenge_information = {
            id: challengeInformation?.id,
            title: (current[2] as HTMLInputElement).value,
            description: (current[1] as HTMLInputElement).value,
            category: (current[3] as HTMLInputElement).value,
            exploit: (current[4] as HTMLInputElement).value,
        }
        // const role_id = event.currentTarget["3"].children
        // console.log(user_id, username, email, role_id);
        console.log(new_challenge_information);
        
        // updateUser(new_user_information, getJwtInLocalStorage()).then(() => {
        //     router.push('/admin/challenges');
        // })
        
        
        
    }

    return (
        loaded && challengeInformation && (
            <main>
                <div className="block ml-auto mr-auto max-w-2xl mt-20">
                    <h1 className="mb-20 text-center text-xl">{challengeInformation.title}</h1>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className="relative z-0 max-w-xl mb-6 group">
                            <label htmlFor="uuid" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Unique ID:</label>
                            <input type="text" id="uuid" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={challengeInformation.id} disabled readOnly />
                        </div>
                        <div className="relative z-0 max-w-xl mb-6 group">
                            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title:</label>
                            <input onChange={(e) => handleChange(e)} type="text" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={challengeInformation.title} required />
                        </div>

                        <div className="relative z-0 max-w-xl mb-6 group">
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description:</label>
                            <input onChange={(e) => handleChange(e)} type="text" id="description" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={challengeInformation.description} required />
                        </div>

                        <div className="relative z-0 max-w-xl mb-6 group">
                            <label htmlFor="categories" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category: </label>
                            <select onChange={(a) => console.log(a.target.value)} id="categories" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">

                                {

                                    categories && (categories.map((category) => (
                                        <option value={category.id}>{category.name}</option>
                                    )))
                                }
                            </select>

                        </div>
                        <div className="relative z-0 max-w-xl mb-6 group">
                            <label htmlFor="exploit" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Exploit:</label>
                            <input onChange={(e) => handleChange(e)} type="text" id="exploit" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={challengeInformation.exploit} required />
                        </div>
                        <button type="submit" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ">
                            Update Challenge
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