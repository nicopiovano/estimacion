import styles from './InputText.module.css';

interface InputTextProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  multiline?: boolean;
  rows?: number;
}

export function InputText({
  id,
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  multiline = false,
  rows = 4,
}: InputTextProps) {
  const inputProps = {
    id,
    value,
    placeholder,
    disabled,
    className: `${styles.input} ${error ? styles.inputError : ''}`,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
  };

  return (
    <div className={styles.wrapper}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      {multiline ? (
        <textarea {...inputProps} rows={rows} />
      ) : (
        <input {...inputProps} type="text" />
      )}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
