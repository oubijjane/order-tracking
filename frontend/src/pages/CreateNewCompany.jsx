import CompanyForm from "../components/NewCompanyForm";


function CreateCompanyPage() {
    return (
        <div className="edit-container">
            <h1>nouvelle compagnie</h1>
            <CompanyForm />
        </div>
    );
}

export default CreateCompanyPage;