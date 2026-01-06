import UserForm from "../components/NewUserForm";


function CreateNewUser() {
    return (
        <div className="edit-container">
            <h1>nouvel utilisateur</h1>
            <UserForm />
        </div>
    );
}

export default CreateNewUser;