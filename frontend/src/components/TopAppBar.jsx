import React from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';

export function TopAppBar({ title = 'FitAI X', avatarUrl }) {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'rgba(9,9,15,0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px',
        boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
      }}
    >
      <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '1.5px solid rgba(245,196,0,0.3)',
            background: 'rgba(255,255,255,0.05)',
            flexShrink: 0,
          }}
        >
          <img
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            src={
              avatarUrl ||
              'https://lh3.googleusercontent.com/aida-public/AB6AXuBKWOr9Ob6p48gO7Ap8ipBBhjvZx_Yu2SECOX8ZG_JOewzpBCW4CA6lLOGeiT7buA8RmIeuqdvjHZ_vSp0G_r4kNCTa2umLLTtSL9EYuaKF8MgKIPXQRMvJ5ujq8g6PZSlzW0Z8jAj7h8pgwHq861nEN9Cfx52PBOtUxldI5rsJRVwtQjIAhOKkDQgc6qII0C7jZoS6lhEGCyUma_2lKlPuU8i9ZRQ_UUQ310iQD1M0uyPsS6A1ScG5qg'
            }
            alt="Profile Avatar"
          />
        </div>
        <span
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 900,
            fontSize: '1.25rem',
            letterSpacing: '-0.02em',
            color: '#F5C400',
          }}
        >
          {title}
        </span>
      </Link>

      <button
        style={{
          background: 'transparent',
          border: 'none',
          color: '#F5C400',
          cursor: 'pointer',
          padding: 4,
          display: 'flex',
          alignItems: 'center',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        <Bell style={{ width: 22, height: 22 }} />
      </button>
    </header>
  );
}
