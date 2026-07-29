import React from 'react';
import { NavLink } from 'react-router-dom';
import { House, Dumbbell, Sparkles, HeartPulse, ChartColumn } from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Home', Icon: House },
  { to: '/workout/session', label: 'Workout', Icon: Dumbbell },
  { to: '/workout/ai-creator', label: 'AI', Icon: Sparkles },
  { to: '/recovery', label: 'Recovery', Icon: HeartPulse },
  { to: '/records', label: 'Records', Icon: ChartColumn },
];

export function BottomNavBar() {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        background: 'rgba(19, 19, 31, 0.85)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 72,
        paddingLeft: 8,
        paddingRight: 8,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
      }}
    >
      {navItems.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            gap: 2,
            padding: '4px 12px',
            borderRadius: 12,
            color: isActive ? '#F5C400' : 'rgba(144,144,176,0.6)',
            fontWeight: isActive ? 700 : 400,
            transition: 'color 0.2s, transform 0.2s',
            transform: isActive ? 'scale(1.1)' : 'scale(1)',
          })}
        >
          {({ isActive }) => (
            <>
              <Icon style={{ width: 22, height: 22 }} />
              <span
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: isActive ? '#F5C400' : 'rgba(144,144,176,0.6)',
                }}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
