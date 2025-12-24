
function Button({onClick, disabled=false, text, className}) {
    return (
        <button 
            onClick={onClick}
            disabled={disabled}
            className={className ? className :disabled ? "disabled-button" : "enabled-button"}
        >
            {text}
        </button>
    );
}

export default Button;