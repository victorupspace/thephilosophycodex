import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./Input.module.css";

interface FieldProps { label: ReactNode; hint?: ReactNode; error?: ReactNode; id: string; children: ReactNode }

export function Field({ label, hint, error, id, children }: FieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className={styles.hint}>{hint}</p>}
      {error && <p id={`${id}-error`} className={styles.error} role="alert">{error}</p>}
    </div>
  );
}

export function Input(props: ComponentPropsWithoutRef<"input">) {
  return <input {...props} className={[styles.input, props.className].filter(Boolean).join(" ")} />;
}
export function Textarea(props: ComponentPropsWithoutRef<"textarea">) {
  return <textarea {...props} className={[styles.input, props.className].filter(Boolean).join(" ")} />;
}
export function Select(props: ComponentPropsWithoutRef<"select">) {
  return <select {...props} className={[styles.input, props.className].filter(Boolean).join(" ")} />;
}
