import { Controller, useFormContext} from "react-hook-form";
import { useEffect } from "react";
import Select from "react-select";
import { ORDER_STATUS_MAP, statusLabel, formatDate, WINDOW_TYPES } from '../utils/formUtils';

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

function OrderCheckboxList({ label, name, orders = [], validation }) {
  const { register, setValue, formState: { errors } } = useFormContext();

  useEffect(() => {
    // Preselect AVAILABLE orders
    const availableOrders = orders
      .filter(order => order.orderStatus === "AVAILABLE")
      .map(order => order.orderId);

    setValue(name, availableOrders);
  }, [orders, setValue, name]);

  return (
    <div className="input-field">
      <div className="lable-field">
        <label>{label}</label>
      </div>

      <div className="checkbox-container" style={{ maxHeight: '150px', overflowY: 'auto' }}>
        {orders.map(order => {
          const isAvailable = order.orderStatus === "AVAILABLE";

          return (
            <label
              key={order.orderId}
              className="checkbox-item"
              style={{
                display: "block",
                padding: "6px",
                marginBottom: "6px",
                background: isAvailable ? "#f9f9f9" : "#f1f1f1",
                color: isAvailable ? "inherit" : "#999",
                borderRadius: "4px",
                cursor: isAvailable ? "pointer" : "not-allowed"
              }}
            >
              <input
                type="checkbox"
                value={order.orderId}
                disabled={!isAvailable}
                {...register(name, validation)}
              />

              {" "}
              {order.windowType} — {ORDER_STATUS_MAP[order.orderStatus]}
            </label>
          );
        })}
      </div>

      {errors[name] && (
        <span className="error-text" style={{ color: "red", fontSize: "12px" }}>
          {errors[name].message}
        </span>
      )}
    </div>
  );
}

function SearchableDropdown({
  label,
  name,
  options = [],
  validation,
  multiple = false
}) {
  const { control, formState: { errors } } = useFormContext();

  // Normalize options so both string[] and {value,label}[] work
  const formattedOptions = options.map(opt =>
    typeof opt === "string"
      ? { value: opt, label: opt }
      : opt
  );

  return (
    <div className="input-field">
      <div className="lable-field">
        <label>{label}</label>
      </div>

      <Controller
        name={name}
        control={control}
        rules={validation}
        render={({ field }) => {
          // For single select we must convert stored value to option object
          const selectedValue = multiple
            ? formattedOptions.filter(opt => field.value?.includes(opt.value))
            : formattedOptions.find(opt => opt.value === field.value) || null;

          return (
            <Select
              options={formattedOptions}
              isMulti={multiple}
              isSearchable
              className={errors[name] ? "input-error" : ""}
              value={selectedValue}
              onChange={(selected) => {
                if (multiple) {
                  field.onChange(selected ? selected.map(s => s.value) : []);
                } else {
                  field.onChange(selected ? selected.value : "");
                }
              }}
            />
          );
        }}
      />

      {errors[name] && (
        <span
          className="error-text"
          style={{ color: "red", fontSize: "12px" }}
        >
          {errors[name].message}
        </span>
      )}
    </div>
  );
}
export { InputField, Dropdown, OrderCheckboxList, SearchableDropdown };
