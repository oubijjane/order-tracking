import { Link } from "react-router";


function SectionCard({action}) {
     return (
    <div className={`stat-card action`}>
      <Link to={`${action}`} style={{ textDecoration: 'none', color: '#333' }}>
            <h2>{action}</h2>
      </Link>
    </div>
  );
}

export default SectionCard;