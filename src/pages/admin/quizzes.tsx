import AsideAdminComponent from "@/components/AsideAdminComponent";
import NavbarAdminComponent from "@/components/NavbarAdminComponent";

const AdminQuizzes = () => {
    return (
        <main>
            <NavbarAdminComponent openHandler={setOpened} opened={opened} userInformation={userInformation} />
            <AsideAdminComponent />
        </main>
    )
}

export default AdminQuizzes;