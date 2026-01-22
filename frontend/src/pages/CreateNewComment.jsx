import CommentForm from "../components/NewComment";


function CreateCommentPage() {
    return (
        <div className="edit-container">
            <h1>nouvelle commentaire</h1>
            <CommentForm />
        </div>
    );
}

export default CreateCommentPage;