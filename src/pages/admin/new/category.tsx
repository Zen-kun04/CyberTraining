import SuccessAlertComponent from "@/components/SuccessAlertComponent";
import { AlertEnum } from "@/types/AlertType";
import { createCategory } from "@/utils/APIUtils";
import { isAdministrator } from "@/utils/AuthUtils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const NewCategory = () => {
    const [loaded, setLoaded] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [categoryName, setCategoryName] = useState<string | null>(null)
    const router = useRouter();
    useEffect(() => {
        isAdministrator().then((response) => {
            if (response === true) {
                setIsAdmin(true);
                setLoaded(true);
            } else {
                router.push('/');
            }
        })
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        createCategory(categoryName!).then(() => {
            <SuccessAlertComponent alert_type={AlertEnum.CATEGORY_CREATE} data={categoryName} />
            setTimeout(() => {
                router.push('/admin/categories')
            }, 1500)
            
        })

    }

    return (
        loaded && isAdmin && (
            <main>
                <div className="block ml-auto mr-auto max-w-2xl mt-20">
                    <h1 className="mb-20 text-center text-xl">Creating a new category</h1>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className="relative z-0 max-w-xl group mb-4">
                            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category name:</label>
                            <input onChange={(e) => setCategoryName(e.currentTarget.value)} type="text" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <button type="submit" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ">
                            Create Category
                        </button>

                    </form>
                </div>

            </main>
        )
    )
}

export default NewCategory;