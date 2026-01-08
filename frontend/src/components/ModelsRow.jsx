import { Link } from "react-router";

function ModelRow({ modelName,carBrand,  id }) {
    return (
        <tr>
            <td style={{ fontWeight: '500' }}>{modelName}</td>
            <td style={{ fontWeight: '500' }}>{carBrand.brand}</td>
            <td>
                <Link to={`edit/${id}`} style={{ textDecoration: 'none', color: '#333' }}>
                    edit 
                </Link>
            </td>
        </tr>
    );
}

export default ModelRow;