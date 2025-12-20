import {ORDER_STATUS_MAP} from '../utils/formUtils';

function ButtonStatus( {status=[], handleClick, disabled = false} ) {
    return (
        status.map((stat) => (<button 
            key={stat}
            onClick={() => handleClick(stat)}
            disabled={disabled}
            className={disabled ? "disabled-button" : "enabled-button"}
        >
            {ORDER_STATUS_MAP[stat]}
        </button>))
    );
}

export default ButtonStatus;