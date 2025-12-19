import {ORDER_STATUS_MAP} from '../utils/formUtils';

function ButtonStatus( {status=[], handleClick} ) {
    return (
        status.map((stat) => (<button 
            key={stat}
            onClick={() => handleClick(stat)}
            style={{
                backgroundColor: '#dc3545', // Red color
                color: 'white', 
                padding: '10px 15px', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer',
                fontWeight: 'bold'
            }}
        >
            {ORDER_STATUS_MAP[stat]}
        </button>))
    );
}

export default ButtonStatus;