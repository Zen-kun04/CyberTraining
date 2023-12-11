import AsideAdminComponent from "@/components/AsideAdminComponent";
import DeleteModalComponent from "@/components/DeleteModalComponent";
import NavbarAdminComponent from "@/components/NavbarAdminComponent";
import SuccessAlertComponent from "@/components/SuccessAlertComponent";
import { AlertEnum, ComponentAlertType } from "@/types/AlertType";
import { DeleteType } from "@/types/DeleteType";
import { UserType } from "@/types/UserType";
import { deleteUser, getAllUsers, userIdExist } from "@/utils/APIUtils";
import { getUserInformationByJwt } from "@/utils/JwtUtils";
import { getJwtInLocalStorage, hasAJwtInLocalStorage, removeJwtInLocalStorage } from "@/utils/LocalStorageUtils";
import { ComponentModule } from "next/dist/build/webpack/loaders/metadata/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"

const AdminUsers = () => {

    const [userInformation, setUserInformation] = useState<UserType | null>(null)
    const [loaded, setLoaded] = useState(false);
    const [opened, setOpened] = useState(false);
    const [users, setUsers] = useState<UserType[]>([]);
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
                        if (result !== null){
                            setUserInformation(result);
                            getAllUsers().then((users) => {
                                console.log("Users:");
                                console.log(users);
                                
                                setUsers(users.result);
                                setLoaded(true);
                            });
                        }else {
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
        const user_id = event.currentTarget.name;
        setSelectedID(user_id);
        setShowModal(true);
    }

    const ModalYesHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        
        userIdExist(selectedID as string).then((result) => {
            if (result) {
                deleteUser(selectedID as string);
                getAllUsers().then((users) => {
                    setUsers(users.result.filter((user) => user.id !== selectedID));
                    setDeleted([...deleted, {type: AlertEnum.USER_DELETE, message: selectedID as string}])
                });
            }else {
                getAllUsers().then((users) => {
                    console.log(users);
                    
                    setUsers(users.result.filter((user) => user.id !== selectedID));
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
                    <h1 className="text-center">User List</h1>



                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    {
                    showModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 flex justify-center items-center">
                        <DeleteModalComponent confirmHandler={ModalYesHandler} cancelHandler={ModalNoHandler} Delete={DeleteType.USER} />
                        
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
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">

                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        ID
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Username
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Rank
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Level
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
                                    users.length > 0 && (
                                        users.map((user) => (
                                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {user.id}
                                                </th>
                                                <td className="px-6 py-4">
                                                {user.username}
                                                </td>
                                                <td className="px-6 py-4">
                                                {user.email}
                                                </td>
                                                <td className="px-6 py-4">
                                                {user.role}
                                                </td>
                                                <td className="px-6 py-4">
                                                {user.level}
                                                </td>
                                                <td className="px-6 py-4">
                                                {user.created_at}
                                                </td>
                                                <td className="px-6 py-4">
                                                {user.updated_at}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <a href={`/admin/edit/user/${user.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={(e) => deleteHandler(e)} name={user.id} className="font-medium text-red-600 dark:text-red-600 hover:underline">Delete</button>
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

export default AdminUsers;