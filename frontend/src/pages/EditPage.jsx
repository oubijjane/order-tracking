import { Outlet} from "react-router";


function EditPage() {
    return (
        <div className="edit-container">
            <h1>Edit </h1>
            <Outlet />
        </div>
    );
}

export default EditPage;