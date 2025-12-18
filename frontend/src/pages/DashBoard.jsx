import StatusList from "../components/StatusList"
import { ORDER_STATUS } from "../utils/formUtils";

function DashBoard() {

    return(
        <div>
            <h1>DashBoard</h1>
            <StatusList statusData={ORDER_STATUS} />
        </div>
    );
}
export default DashBoard;