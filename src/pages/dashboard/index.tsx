import AsideComponent from "@/components/AsideComponent";
import NavbarComponent from "@/components/NavbarComponent";

const UserDashboard = () => {
    return (
        <main>
            <NavbarComponent page="dashboard" fixed />
            <AsideComponent />
            <div className="dashboard mt-20">
                <h1>Welcome to your User Dashboard !</h1>
            </div>
        </main>
        
    )
}

export default UserDashboard;