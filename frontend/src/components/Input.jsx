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


export default InputField;