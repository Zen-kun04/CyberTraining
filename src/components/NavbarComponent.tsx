import { isAdministrator, isAuthentified } from "@/utils/AuthUtils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const NavbarComponent = ({ page, fixed = false}: { page: string, fixed?: boolean }) => {
    const [openMenu, setOpenMenu] = useState(true);
    const [loaded, setLoaded] = useState(true);
    const [logged, setLogged] = useState(false);
    const [admin, setAdmin] = useState(false);

    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === 'dark' ? systemTheme : theme;

    useEffect(() => {
        isAuthentified().then((result) => {
            setLogged(result);
            if (result) {
                isAdministrator().then((result) => {
                    setAdmin(result);
                    setLoaded(true);
                });
            } else {
                setLoaded(true);
            }
        });
    }, [])



    return (
        loaded && (
            <nav className={`bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700 ${fixed ? 'fixed w-full z-50 top-0' : ''}`}>
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="/" className="flex items-center">
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Cyber Training</span>
                    </a>
                    <button data-collapse-toggle="navbar-multi-level" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-multi-level" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input onChange={() => theme == "dark" ? setTheme("light") : setTheme("dark")} type="checkbox" value="" className="sr-only peer" defaultChecked={theme == "dark" ? true : false} />

                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Dark mode</span>
                    </label>
                    <div className="hidden w-full md:block md:w-auto" id="navbar-multi-level">
                        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            <li>
                                {
                                    page == "home" && (
                                        <a href="/" className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:blue-gray-500 dark:bg-blue-600 md:dark:bg-transparent" aria-current="page">Home</a>
                                    )
                                }
                                {
                                    page != "home" && (
                                        <a href="/" className="block py-2 pl-3 pr-4 hover:text-blue-700 text-white bg-blue-700 rounded md:bg-transparent md:text-gray-700 md:p-0 md:dark:text-gray-500 dark:bg-blue-600 md:dark:bg-transparent">Home</a>
                                    )
                                }

                            </li>
                            <li>
                                <button onClick={() => setOpenMenu(!openMenu)} id="dropdownNavbarLink" data-dropdown-toggle="dropdownNavbar" className="flex items-center justify-between w-full py-2 pl-3 pr-4  text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent">Categories <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                </svg></button>
                                <div id="dropdownNavbar" className={`z-10 ${openMenu ? 'hidden' : ''} absolute font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600`}>
                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-400" aria-labelledby="dropdownLargeButton">
                                        <li>
                                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">SQLi</a>
                                        </li>
                                        <li>
                                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">XSS</a>
                                        </li>
                                        <li>
                                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Information Disclosure</a>
                                        </li>
                                        <li>
                                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Cookies</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            {
                                !logged && (
                                    <>
                                        <li>
                                            <a href="/register" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Register</a>
                                        </li>
                                        <li>
                                            <a href="/login" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Login</a>
                                        </li>
                                    </>
                                )
                            }

                            {
                                logged && (
                                    <>
                                        {
                                            page == "dashboard" && (
                                                <li>
                                                    <a href={`${admin ? '/admin/dashboard' : '/dashboard'}`} className="block py-2 pl-3 pr-4 text-blue-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Dashboard</a>
                                                </li>
                                            )
                                        }
                                        {
                                            page != "dashboard" && (
                                                <li>
                                                    <a href={`${admin ? '/admin/dashboard' : '/dashboard'}`} className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Dashboard</a>
                                                </li>
                                            )
                                        }
                                    </>
                                )
                            }
                            <li>
                                <a href="#" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Contact</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

        ));
}

export default NavbarComponent;