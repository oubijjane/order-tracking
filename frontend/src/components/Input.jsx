import { useFormContext} from "react-hook-form";

function InputField({ label, type, name, placeholder = "", validation, multiple }) {
    const { register, formState: { errors } } = useFormContext();
    
    return (
        <div className="input-field">
            <div className="lable-field">
                <label htmlFor={name}>{label}</label>
            </div>
            <input 
                type={type} 
                id={name} 
                placeholder={placeholder} 
                multiple={multiple} // Add this line
                className={errors[name] ? "form-input input-error" : "form-input"}  
                {...register(name, validation)} 
            />
            {errors[name] && (
                <span className="error-message-text" style={{ color: 'red', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                    {errors[name].message}
                </span>
            )}
        </div>
    );
}

function Dropdown({ label, name, options = [], validation, multiple = false }) {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="input-field">
            <div className="lable-field">
                <label htmlFor={name}>{label}</label>
            </div>
            {/* We add the 'multiple' attribute here */}
            <select 
                id={name} 
                multiple={multiple} 
                className={errors[name] ? "form-input input-error" : "form-input"} 
                {...register(name, validation)}
                // When multiple is true, we make the box a bit taller 
                // so you can see the list clearly
                style={multiple ? { height: 'auto', minHeight: '100px' } : {}}
            >
                {/* We only show the "Choose" placeholder for single selects */}
                {!multiple && <option value="">-- {label} --</option>}
                
                {options.map(opt => (
                    typeof opt === 'string'
                        ? <option key={opt} value={opt}>{opt}</option>
                        : <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            {/* Added error message display so you can see the "Only 1 role" warning */}
            {errors[name] && <span className="error-text" style={{color: 'red', fontSize: '12px'}}>{errors[name].message}</span>}
        </div>
    );
}

export { InputField, Dropdown };