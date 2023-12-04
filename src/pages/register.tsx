import NavbarComponent from "@/components/NavbarComponent";
import ParticlesComponent from "@/components/ParticlesComponent";
import { FormRegisterType } from "@/types/EventTarget";
import { isJwtValid } from "@/utils/JwtUtils";
import { JwtInLocalStorage, getJwtInLocalStorage, hasAJwtInLocalStorage, removeJwtInLocalStorage, setJwtInLocalStorage } from "@/utils/LocalStorageUtils";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const RegisterPage = () => {
    // document.title = "CyberTraining - Login to your account"
    const [message, setMessage] = useState<string | null>(null);
    const [loaded, setLoaded] = useState<boolean>(false);
    const router = useRouter();
    useEffect(() => {
        if (hasAJwtInLocalStorage()) {
            const checkJwt = async () => {
                const req = await fetch("http://127.0.0.1/api/session", {
                    method: "GET",
                    headers: {
                        Authorization: getJwtInLocalStorage()
                    }
                });

                const resp = await req.json();
                if (resp.code === 200) {
                    router.push('/');
                } else {
                    removeJwtInLocalStorage();
                    setLoaded(true);
                }
            }
            checkJwt();
        }else {
            setLoaded(true);
        }
    }, [])

    const handleForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form_data = event.target as unknown as FormRegisterType;
        
        
        if(form_data.floating_username.length < 3 || form_data.floating_username.length > 45){
            setMessage("Your username should have between 3 and 45 characters")
        } else if(form_data.floating_password.value !== form_data.floating_repeat_password.value) {
            setMessage("Your password doesn't match with the repeated one")
        }else{
            const data = {
                username: form_data.floating_username.value,
                email: form_data.floating_email.value,
                password: form_data.floating_password.value
            }
    
            const request = await fetch("http://127.0.0.1/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
    
            const d = await request.json();
    
            if (d.code === 200) {
                if (!JwtInLocalStorage(d.jwt)) {
                    setJwtInLocalStorage(d.jwt);
                }
                router.push('/');
            } else {
                console.log(d);
                
                setMessage("Invalid credentials");
            }
        }
        
    }

    return (
        loaded && (
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
                    <div className="relative z-0 w-full mb-6 group">
                        <input type="text" name="floating_username" id="floating_username" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="floating_username" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Username</label>
                    </div>
                    
                    <div className="relative z-0 max-w-xl mb-6 group">
                        <input type="password" name="floating_password" id="floating_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="floating_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                        <input type="password" name="repeat_password" id="floating_repeat_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="floating_repeat_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Confirm password</label>
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>
            </div>
            <ParticlesComponent />
        </main>)
    )
}

export default RegisterPage;