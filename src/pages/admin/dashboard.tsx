import AsideAdminComponent from "@/components/AsideAdminComponent";
import NavbarAdminComponent from "@/components/NavbarAdminComponent";
import { UserType } from "@/types/UserType";
import { getUserInformationByJwt } from "@/utils/JwtUtils";
import { getJwtInLocalStorage, hasAJwtInLocalStorage, removeJwtInLocalStorage } from "@/utils/LocalStorageUtils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"

const AdminDashboard = () => {
    const [loaded, setLoaded] = useState(false);
    const [opened, setOpened] = useState(false);
    const [userInformation, setUserInformation] = useState<UserType | null>(null)
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
                            setLoaded(true);
                        }else {
                            router.push('/');
                        }
                    })
                    
                }
            }
            checkJwt();
        } else {
            router.push('/');
        }
    }, []);

    return (
        loaded && (
            <main>
                
                <NavbarAdminComponent openHandler={setOpened} opened={opened} userInformation={userInformation} />
                <AsideAdminComponent />
                <div className="mt-20 dashboard">
                    <h1>Welcome {userInformation?.username}</h1>
                </div>
                
            </main>
        )
    )
}

export default AdminDashboard;