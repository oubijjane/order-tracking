import { Link } from "react-router";

function Row({ name,  id , enabled, enablStatus = false, type}) {
    return (
        <tr>
            <td style={{ fontWeight: '500' }}>{name}</td>
            {enablStatus && <td><span className={`status-badge ${enabled ? "status-active" : "status-inactive"}`}>
                    {enabled ? "Actif" : "Inactif"}
                </span> </td>}
            <td>
                <Link to={`/admin/edit/${type}/${id}`} style={{ textDecoration: 'none', color: '#333' }}>
                    edit 
                </Link>
            </td>
        </tr>
    );
}

export default Row;