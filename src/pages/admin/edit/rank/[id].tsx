import DangerAlertComponent from "@/components/DangerAlertComponent";
import { RankType } from "@/types/RankType";
import { getRankById, rankIdExist, updateRank, updateUser, userIdExist } from "@/utils/APIUtils";
import { getJwtInLocalStorage } from "@/utils/LocalStorageUtils";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const EditRank = () => {
    const router = useRouter();
    const { id } = router.query as { id: string };
    const [loaded, setLoaded] = useState<boolean>(false);
    const [rankInformation, setRankInformation] = useState<RankType | null>(null);

    useEffect(() => {
        if (id) {
            rankIdExist(id).then((result) => {
                if (result) {
                    getRankById(id).then((rank_result) => {
                        setRankInformation(rank_result);
                        setLoaded(true);
                    });
                } else {
                    router.push('/admin/ranks')
                }
            })
        }

    }, [id])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.id === "admin") {
            setRankInformation(previous => ({
                ...previous,
                [event.target.id]: event.target.checked || false
            }))
        }else {
            setRankInformation(previous => ({
                ...previous,
                [event.target.id]: event.target.value || ''
            }))
        }
        
        console.log(rankInformation);
        
    }


    const handleCheck = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        setRankInformation(previous => ({
            ...previous,
            admin: event.target.checked || false
        }))

    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const current = event.currentTarget;

        updateRank(rankInformation!, getJwtInLocalStorage()).then(() => {
            router.push('/admin/ranks');
        })



    }

    return (
        loaded && rankInformation && (
            <main>
                <div className="block ml-auto mr-auto max-w-2xl mt-20">
                    <h1 className="mb-20 text-center text-xl">{rankInformation.name}</h1>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className="relative z-0 max-w-xl mb-6 group">
                            <label htmlFor="uuid" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Unique ID:</label>
                            <input type="text" id="uuid" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={rankInformation.id} disabled readOnly />
                        </div>
                        <div className="relative z-0 max-w-xl mb-4 group">
                            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name:</label>
                            <input onChange={(e) => handleChange(e)} type="text" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={rankInformation.name} required />
                        </div>
                        <div className="flex items-center mb-6">
                            <input onChange={(e) => handleChange(e)} id="admin" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" checked={rankInformation.admin} />
                            <label htmlFor="link-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Rank with admin rights</label>
                        </div>
                        <button type="submit" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ">
                            Update Rank
                        </button>

                    </form>
                </div>

            </main>
        ))
}

export default EditRank;