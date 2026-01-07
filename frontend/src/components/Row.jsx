import { Link } from "react-router";

function Row({ name,  id , type}) {
    return (
        <tr>
            <td style={{ fontWeight: '500' }}>{name}</td>
            <td>
                <Link to={`/admin/edit/${type}/${id}`} style={{ textDecoration: 'none', color: '#333' }}>
                    edit 
                </Link>
            </td>
        </tr>
    );
}

export default Row;