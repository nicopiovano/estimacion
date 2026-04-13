import { InputText } from '../../atoms/InputText/InputText';
import styles from './FormField.module.css';

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
}

export function FormField({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  disabled,
  multiline,
  rows,
  required = false,
}: FormFieldProps) {
  return (
    <div className={styles.fieldWrapper}>
      <InputText
        id={id}
        label={required ? `${label} *` : label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        error={error}
        disabled={disabled}
        multiline={multiline}
        rows={rows}
      />
      {hint && !error && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}
