import { Link } from "react-router";

function UserRow({ username, email, enabled, id }) {
    return (
        <tr>
            <td style={{ fontWeight: '500' }}>{username}</td>
            <td style={{ color: '#64748b' }}>{email || "Non renseigné"}</td>
            <td>
                {/* Added conditional classes for the badge */}
                <span className={`status-badge ${enabled ? "status-active" : "status-inactive"}`}>
                    {enabled ? "Actif" : "Inactif"}
                </span>
            </td>
            <td>
                <Link to={`${id}`} style={{ textDecoration: 'none', color: '#333' }}>
                    edit
                </Link>
            </td>
        </tr>
    );
}

export default UserRow;