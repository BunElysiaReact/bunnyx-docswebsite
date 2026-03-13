import { useState } from 'react';

export function Tooltip({ children, text, position = 'top' }) {
  const [visible, setVisible] = useState(false);
  return (
    <span
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span style={{
          position: 'absolute',
          background: '#222',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          bottom: position === 'top' ? '120%' : 'auto',
          top: position === 'bottom' ? '120%' : 'auto',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 999,
          pointerEvents: 'none',
        }}>
          {text}
        </span>
      )}
    </span>
  );
}