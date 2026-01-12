import  SectionCard from '../components/SectionCard';
import "../styles/DashBoard.css"; 

 function AdminDashBoard() {

  return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <h1>Tableau de Bord Admin</h1>
                <div className="header-line"></div>
            </header>
            <section className="stats-section">
                <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0' }}>
                <SectionCard action={"Utilisateurs"}/>
                <SectionCard action={"Companies"}/>
                <SectionCard action={"Marques"}/>
                <SectionCard action={"Modèles"}/>
                <SectionCard action={"Commentaires"}/>
                <SectionCard action={"Villes"}/>
                <SectionCard action={"Transport"}/>
                </div>
            </section>
        </div>
    );

 }

 export default AdminDashBoard;