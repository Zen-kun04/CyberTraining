import AsideComponent from "@/components/AsideComponent";
import NavbarComponent from "@/components/NavbarComponent";
import UserContext from "@/context/UserContext";
import { RankType } from "@/types/RankType";
import { getRankById } from "@/utils/APIUtils";
import { isJwtValid } from "@/utils/JwtUtils";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

const UserProfile = () => {
    const userContext = useContext(UserContext);
    if (!userContext) {
        throw "You need to envelop the app with UserContext !"
    }
    const { user, setUser } = userContext;
    const { theme } = useTheme();
    const [loaded, setLoaded] = useState(false);
    const [rankInfo, setRankInfo] = useState<RankType | {}>({});
    const router = useRouter();
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
                    const info = await request.json();
                    const userID = info.result.id;
                    const userReq = await fetch(`http://localhost/api/user/${userID}`, {
                        headers: {
                            Authorization: token
                        }
                    });
                    const userInfo = await userReq.json();
                    
                    setUser(userInfo.result);
                    console.log("information");
                    
                    console.log(userInfo.result);
                    
                } else {
                    router.push('/login');
                }
            })()
        }
    }, [])

    useEffect(() => {
        if (user) {
            getRankById(user.rank_id).then((info) => {
                setRankInfo(info);
                setLoaded(true);
            })
        }

    }, [user])
    return loaded && user && (
        <main>
            <NavbarComponent page="dashboard_profile" fixed />
            <AsideComponent />
            <div className={`${theme === 'dark' ? 'shadow-customBoxDark' : 'shadow-customBoxLight'} mt-24 sm:absolute sm:right-14 mx-auto flex justify-center flex-wrap gap-4 w-3/4 lg:relative lg:mx-auto md:w-1/2 rounded-xl py-12`}>

                <div className="flex flex-col">
                    <label htmlFor="id">Username:</label>
                    <input type="text" value={user.username} />
                </div>
                <div className="flex flex-col">
                    <p>Level:</p>
                    <p>{user.level}</p>
                </div>
                {/* <div className="flex flex-col">
                    <p>Rank:</p>
                    <p>{rankInfo.name}</p>
                </div> */}
            </div>
        </main>
    )
}

export default UserProfile;