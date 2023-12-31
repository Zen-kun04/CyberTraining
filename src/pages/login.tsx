import NavbarComponent from "@/components/NavbarComponent";
import ParticlesComponent from "@/components/ParticlesComponent";
import UserContext from "@/context/UserContext";
import { getUserById } from "@/utils/APIUtils";
import { isJwtValid } from "@/utils/JwtUtils";
import { JwtInLocalStorage, getJwtInLocalStorage, hasAJwtInLocalStorage, removeJwtInLocalStorage, setJwtInLocalStorage } from "@/utils/LocalStorageUtils";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

const LoginPage = () => {
    // document.title = "CyberTraining - Login to your account"
    const [message, setMessage] = useState<string | null>(null);
    const [loaded, setLoaded] = useState<boolean>(false);
    const router = useRouter();

    const userContext = useContext(UserContext);
    if(!userContext) {
        throw "You need to envelop the app with UserContext !";
    }

    const {user} = userContext;

    useEffect(() => {
        const token = window.localStorage.getItem("token");
        if (token !== null) {
            (async () => {
                const request = await fetch("http://localhost/api/jwt/decode", {
                    headers: {
                        Authorization: token
                    }
                });
                if (request.status === 200) {
                    router.push('/');
                }else{
                    setLoaded(true);
                }
            })()
        }else{
            setLoaded(true);
        }
    }, [])
    
    const handleForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = new FormData(event.currentTarget);
        const obj = Object.fromEntries(form.entries());
        const data = {
            email: obj.floating_email,
            password: obj.floating_password
        }

        const request = await fetch("http://127.0.0.1/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const d = await request.json();

        if (d.code === 200){
            if(!JwtInLocalStorage(d.jwt)){
                
                setJwtInLocalStorage(d.jwt);
            }
            router.push('/');
        }else {
            setMessage("Invalid credentials");
        }
    }

    return (
        loaded && user === null && (
        <main>
            <NavbarComponent page="login" />
            <div className="block ml-auto mr-auto max-w-xl mt-20">
                <h1 className="mb-20 text-center text-xl">Login to your CyberTraining account</h1>
                <form onSubmit={handleForm}>
                    <div className={`${message === null ? 'hidden' : ''} mb-10 rounded-md text-center bg-red-600 text-white`}>
                        {message}
                    </div>
                    <div className="relative z-0 max-w-xl mb-6 group">
                        <input type="email" name="floating_email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
                    </div>
                    <div className="relative z-0 max-w-xl mb-6 group">
                        <input type="password" name="floating_password" id="floating_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="floating_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>
            </div>
            <ParticlesComponent />
        </main>)
    )
}

export default LoginPage;