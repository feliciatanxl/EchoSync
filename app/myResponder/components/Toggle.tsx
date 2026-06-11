'use client';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export default function Toggle({ checked, onChange, label, description, disabled = false }: ToggleProps) {
  const toggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div className="mr-toggle-wrapper">
      {(label || description) && (
        <div style={{ paddingRight: 16 }}>
          {label ? <div className="mr-title-sm">{label}</div> : null}
          {description ? (
            <div className="mr-body-sm" style={{ color: 'var(--gray-500)', marginTop: 2 }}>
              {description}
            </div>
          ) : null}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={toggle}
        className={`mr-toggle-track${checked ? ' active' : ''}`}
        style={{
          border: 0,
          opacity: disabled ? 0.55 : 1,
        }}
      >
        <span className="mr-toggle-thumb" />
      </button>
    </div>
  );
}
