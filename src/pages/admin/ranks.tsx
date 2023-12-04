import AsideAdminComponent from "@/components/AsideAdminComponent";
import DeleteModalComponent from "@/components/DeleteModalComponent";
import NavbarAdminComponent from "@/components/NavbarAdminComponent";
import SuccessAlertComponent from "@/components/SuccessAlertComponent";
import { AlertEnum, ComponentAlertType } from "@/types/AlertType";
import { DeleteType } from "@/types/DeleteType";
import { RankType } from "@/types/RankType";
import { UserType } from "@/types/UserType";
import { deleteRank, getAllRanks, getRankById, rankIdExist } from "@/utils/APIUtils";
import { getUserInformationByJwt } from "@/utils/JwtUtils";
import { getJwtInLocalStorage, hasAJwtInLocalStorage } from "@/utils/LocalStorageUtils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"

const AdminRanks = () => {

    const [userInformation, setUserInformation] = useState<UserType | null>(null)
    const [loaded, setLoaded] = useState(false);
    const [opened, setOpened] = useState(false);
    const [ranks, setRanks] = useState<RankType[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedID, setSelectedID] = useState<string | null>(null);
    const [deleted, setDeleted] = useState<ComponentAlertType[]>([]);
    const router = useRouter();
    useEffect(() => {
        if (hasAJwtInLocalStorage()) {
            const checkJwt = async () => {
                const req = await fetch("http://127.0.0.1/api/admin", {
                    method: "GET",
                    headers: {
                        Authorization: getJwtInLocalStorage()
                    }
                });

                const resp = await req.json();
                if (resp.code !== 200) {
                    router.push('/');
                } else {
                    getUserInformationByJwt(getJwtInLocalStorage()).then((result) => {
                        if (result !== null) {
                            setUserInformation(result);
                            // Get all ranks
                            getAllRanks().then((response) => {
                                setRanks(response);
                            })
                            setLoaded(true);
                        } else {
                            router.push('/');
                        }
                    });
                }
            }
            checkJwt();
        } else {
            router.push('/');
        }
    }, []);

    const deleteHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const rank_id = event.currentTarget.name;
        setSelectedID(rank_id);
        setShowModal(true);
    }

    const ModalYesHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        rankIdExist(selectedID as string).then((result) => {
            if (result) {
                getRankById(selectedID!).then((rank) => {
                    setDeleted([...deleted, { type: AlertEnum.RANK_DELETE, message: rank.name as string }])
                })
                deleteRank(selectedID as string).then(() => {
                    getAllRanks().then((ranks) => {
                        setRanks(ranks.filter((rank) => rank.id !== selectedID));
                    });
                });

            }

        })

        setShowModal(false);
    }

    const ModalNoHandler = () => {
        setShowModal(false);
    }

    useEffect(() => {
        if (deleted.length > 0) {
            const timeout = setTimeout(() => {
                setDeleted(deleted.slice(1));
            }, 2500);
            return () => clearTimeout(timeout);
        }
    }, [deleted]);

    return (
        loaded && (
            <main>
                <NavbarAdminComponent openHandler={setOpened} opened={opened} userInformation={userInformation} />
                <AsideAdminComponent />
                <div className="mt-20 dashboard">
                    <h1 className="text-center">Rank List</h1>



                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        {
                            showModal && (
                                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 flex justify-center items-center">
                                    <DeleteModalComponent confirmHandler={ModalYesHandler} cancelHandler={ModalNoHandler} Delete={DeleteType.RANK} />

                                </div>
                            )
                        }
                        {
                            deleted.length > 0 && (
                                deleted.map((data) => (
                                    <SuccessAlertComponent alert_type={data.type} data={data.message} />
                                ))
                            )
                        }
                        <button onClick={() => router.push('/admin/new/rank')} type="button" className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Create new rank</button>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">

                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        ID
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Administrator
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Created at
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Updated at
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <span className="sr-only">Delete</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    ranks.length > 0 && (
                                        ranks.map((rank) => (
                                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {rank.id}
                                                </th>
                                                <td className="px-6 py-4">
                                                    {rank.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {rank.admin ? 'Yes' : 'No'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {rank.created_at}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {rank.updated_at}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <a href={`/admin/edit/rank/${rank.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={(e) => deleteHandler(e)} name={rank.id} className="font-medium text-red-600 dark:text-red-600 hover:underline">Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                }

                            </tbody>
                        </table>
                    </div>



                </div>

            </main>
        )
    )
}

export default AdminRanks;