import { Link } from "react-router";

function CompanyRow({ companyName,  id }) {
    return (
        <tr>
            <td style={{ fontWeight: '500' }}>{companyName}</td>
            <td>
                <Link to={`${id}`} style={{ textDecoration: 'none', color: '#333' }}>
                    edit
                </Link>
            </td>
        </tr>
    );
}

export default CompanyRow;