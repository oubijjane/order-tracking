import { useFormContext} from "react-hook-form";

function InputField({ label, type, name, placeholder = "", validation }) {
    const { register, formState: { errors } } = useFormContext()
    return (
        <div className="input-field">
            <div className="lable-field">
                <label htmlFor={name}>{label}</label>
                <p className="error-message">{errors[name]?.message}</p>
            </div>
            <input type={type} id={name} name={name}  placeholder={placeholder} className={errors[name] ? "input-error" : ""}  {...register(name, validation)} />
        </div>
    );
}

function Dropdown({ label, name, options = [], validation }) {
    const { register, formState: { errors } } = useFormContext()
    return (
        <div className="input-field">
            <div className="lable-field">
                <label htmlFor={name}>{label}</label>
                <p className="error-message">{errors[name]?.message}</p>
            </div>
            <select id={name} name={name} className={errors[name] ? "input-error" : ""} {...register(name, validation)}>
                <option value="">-- {label} --</option>
                {options.map(opt => (
                    typeof opt === 'string'
                        ? <option key={opt} value={opt}>{opt}</option>
                        : <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
}

export { InputField, Dropdown };