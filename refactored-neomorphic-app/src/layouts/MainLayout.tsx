import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Phone,
  BarChart2,
  MessageSquare,
  FileText,
  BookOpen,
  Shuffle,
  User as UserIcon,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  Search,
  ChevronLeft,
  Package,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';
import { logout } from '../features/auth/authSlice';

/* ─────────────────────────────────────────────────────────────
   Types
────────────────────────────────────────────────────────────── */
interface NavItemDef {
  icon: React.ReactNode;
  label: string;
  path?: string;
  badge?: string;
  badgeVariant?: 'gold' | 'red' | 'green';
  onClick?: () => void;
}

interface NavItemProps extends NavItemDef {
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
  muted?: boolean;
}

/* ─────────────────────────────────────────────────────────────
   Single Nav Item — matches reference HTML exactly
────────────────────────────────────────────────────────────── */
const NavItem: React.FC<NavItemProps> = React.memo(
  ({ icon, label, badge, badgeVariant = 'gold', active, collapsed, onClick, muted }) => {
    const badgeColors: Record<string, React.CSSProperties> = {
      gold:  { background: '#F5A623', color: '#1C2033' },
      red:   { background: '#C8102E', color: '#fff' },
      green: { background: '#0D9E6E', color: '#fff' },
    };

    return (
      <button
        onClick={onClick}
        style={
          active
            ? {
                background: '#C8102E',
                color: '#fff',
                boxShadow: '5px 5px 16px rgba(200,16,46,0.42), -2px -2px 8px rgba(255,255,255,0.42)',
              }
            : { background: 'none' }
        }
        className={[
          'w-full flex items-center gap-[10px] px-[10px] py-[9px] rounded-[12px]',
          'border-none outline-none cursor-pointer text-left',
          'relative whitespace-nowrap text-[13.5px] font-[500]',
          'transition-all duration-[180ms] select-none group',
          active
            ? 'text-white'
            : muted
            ? 'text-[#7A8799] hover:bg-[#EDF1F7]'
            : 'text-[#4A5568] hover:bg-[#EDF1F7] hover:text-[#1C2033] hover:translate-x-[2px]',
        ].join(' ')}
      >
        {/* Icon container */}
        <span
          className={[
            'w-[34px] h-[34px] min-w-[34px] flex items-center justify-center',
            'rounded-[10px] text-base flex-shrink-0 transition-colors duration-[180ms]',
            active ? 'text-white' : 'text-[#4A5568] group-hover:text-[#C8102E]',
          ].join(' ')}
        >
          {icon}
        </span>

        {/* Label */}
        <span
          className="flex-1 overflow-hidden transition-all duration-[380ms]"
          style={{
            opacity: collapsed ? 0 : 1,
            maxWidth: collapsed ? 0 : 180,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {label}
        </span>

        {/* Badge */}
        {badge && (
          <span
            className="text-[10px] font-[700] px-[7px] py-[2px] rounded-[20px] flex-shrink-0 transition-opacity duration-[200ms]"
            style={{
              fontFamily: "'Sora', sans-serif",
              ...badgeColors[badgeVariant],
              opacity: collapsed ? 0 : 1,
              pointerEvents: collapsed ? 'none' : 'auto',
            }}
          >
            {badge}
          </span>
        )}

        {/* Tooltip — only visible when collapsed */}
        <span
          className={[
            'absolute left-[68px] top-1/2 -translate-y-1/2',
            'bg-[#1C2033] text-white text-[12px] font-[500] px-[11px] py-[5px]',
            'rounded-[9px] whitespace-nowrap pointer-events-none z-[200]',
            'transition-opacity duration-[180ms]',
            'shadow-[4px_4px_14px_rgba(28,32,51,0.25)]',
          ].join(' ')}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            opacity: collapsed ? undefined : 0,
          }}
        >
          {/* Arrow */}
          <span
            className="absolute right-full top-1/2 -translate-y-1/2"
            style={{
              border: '5px solid transparent',
              borderRightColor: '#1C2033',
            }}
          />
          {label}
        </span>
      </button>
    );
  }
);

/* ─────────────────────────────────────────────────────────────
   Section label
────────────────────────────────────────────────────────────── */
const SectionLabel: React.FC<{ label: string; collapsed: boolean }> = React.memo(
  ({ label, collapsed }) => (
    <div
      className="text-[9.5px] font-[700] tracking-[0.12em] uppercase text-[#7A8799] px-[10px] pt-[12px] pb-[4px] whitespace-nowrap transition-opacity duration-[200ms]"
      style={{ fontFamily: "'DM Sans', sans-serif", opacity: collapsed ? 0 : 1 }}
    >
      {label}
    </div>
  )
);

/* ─────────────────────────────────────────────────────────────
   Divider
────────────────────────────────────────────────────────────── */
const SidebarDivider: React.FC = () => (
  <div
    className="h-[1px] mx-[10px] my-[8px]"
    style={{
      background:
        'linear-gradient(to right, transparent, rgba(200,16,46,0.15), transparent)',
    }}
  />
);

/* ─────────────────────────────────────────────────────────────
   Main Layout
────────────────────────────────────────────────────────────── */
const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navigate  = useNavigate();
  const location  = useLocation();
  const dispatch  = useDispatch<AppDispatch>();
  const { user }  = useSelector((state: RootState) => state.auth);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  /* ── Nav sections matching the reference HTML ── */
  const workspaceItems: NavItemDef[] = useMemo(
    () => [
      { icon: <LayoutDashboard size={16} />, label: 'Dashboard',  path: '/dashboard'  },
      { icon: <Package         size={16} />, label: 'Products',   path: '/products'   },
      { icon: <Users           size={16} />, label: 'Pipeline',   path: '/pipeline',  badge: '12', badgeVariant: 'gold' },
      { icon: <Phone           size={16} />, label: 'Voice AI',   path: '/voice',     badge: 'Live', badgeVariant: 'green' },
      { icon: <BarChart2       size={16} />, label: 'Analytics',  path: '/analytics'  },
    ],
    []
  );

  const intelligenceItems: NavItemDef[] = useMemo(
    () => [
      { icon: <MessageSquare size={16} />, label: 'Deal Coach',    path: '/deal-coach',   badge: '3', badgeVariant: 'red' },
      { icon: <FileText      size={16} />, label: 'Call Insights', path: '/call-insights' },
      { icon: <BookOpen      size={16} />, label: 'Playbooks',     path: '/playbooks'     },
      { icon: <Shuffle       size={16} />, label: 'Integrations',  path: '/integrations'  },
    ],
    []
  );

  const accountItems: NavItemDef[] = useMemo(
    () => [
      { icon: <UserIcon    size={16} />, label: 'Profile',   path: '/profile'   },
      { icon: <Settings    size={16} />, label: 'Settings',  path: '/settings'  },
      { icon: <HelpCircle  size={16} />, label: 'Help & Docs', path: '/help'   },
    ],
    []
  );

  const isActive = useCallback(
    (path?: string) => !!path && location.pathname === path,
    [location.pathname]
  );

  /* ── User initials ── */
  const initials = useMemo(() => {
    const name = user?.username ?? 'Guest User';
    return name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('');
  }, [user]);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--color-bg)' }}>

      {/* ════════════════════════════════════
          SIDEBAR wrapper — relative so toggle never clips
      ════════════════════════════════════ */}
      <div className="relative h-screen flex-shrink-0">

        {/* Toggle button — lives OUTSIDE aside so overflow:hidden can't clip it */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="absolute top-[58px] -right-[15px] w-[30px] h-[30px] rounded-full flex items-center justify-center cursor-pointer border-none z-[200] text-[#4A5568] hover:text-white"
          style={{
            background: '#EDF1F7',
            boxShadow: '3px 3px 9px rgba(163,177,194,0.7), -2px -2px 7px rgba(255,255,255,0.85)',
            transform: `rotate(${collapsed ? 180 : 0}deg)`,
            transition: 'background 0.18s, transform 0.38s cubic-bezier(0.77,0,0.18,1)',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#C8102E'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#EDF1F7'; }}
          title="Toggle sidebar"
        >
          <ChevronLeft size={13} />
        </button>

        <aside
          className="h-screen sticky top-0 flex flex-col overflow-hidden z-[100] flex-shrink-0 transition-[width,min-width] duration-[380ms]"
          style={{
            width:    collapsed ? 74  : 264,
            minWidth: collapsed ? 74  : 264,
            background: '#E4E9F0',
            boxShadow: '8px 0 32px rgba(28,32,51,0.14), -4px 0 14px rgba(255,255,255,0.75)',
            transitionTimingFunction: 'cubic-bezier(0.77,0,0.18,1)',
          }}
        >

        {/* ── Logo Area ── */}
        <div
          className="flex items-center gap-[11px] px-[16px] py-[22px] pb-[18px] relative"
          style={{ borderBottom: '1px solid rgba(200,16,46,0.12)', overflow: 'visible' }}
        >
          {/* Logo icon */}
          <div
            className="w-[42px] h-[42px] min-w-[42px] rounded-[13px] flex items-center justify-center flex-shrink-0 cursor-pointer transition-[box-shadow] duration-[200ms]"
            style={{
              background: '#C8102E',
              boxShadow: '4px 4px 14px rgba(200,16,46,0.42), -2px -2px 8px rgba(255,255,255,0.55)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 9l4 2-4 5 10-3 10 3-4-5 4-2z" />
            </svg>
          </div>

          {/* Logo text */}
          <div
            className="overflow-hidden whitespace-nowrap transition-all duration-[380ms]"
            style={{
              opacity:  collapsed ? 0  : 1,
              maxWidth: collapsed ? 0  : 180,
              transitionTimingFunction: 'cubic-bezier(0.77,0,0.18,1)',
            }}
          >
            <h2
              className="text-[15.5px] font-[800] text-[#1C2033] leading-[1.15]"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Magic Carpet
            </h2>
            <span
              className="text-[10px] font-[600] text-[#C8102E] tracking-[0.07em] uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              AI Sales Copilot
            </span>
          </div>
        </div>

        {/* ── User Card ── */}
        <div
          className="mx-[12px] my-[14px] mb-[10px] rounded-[14px] px-[12px] py-[10px] flex items-center gap-[10px] overflow-hidden cursor-pointer transition-[box-shadow] duration-[180ms]"
          style={{
            background: 'var(--color-bg)',
            boxShadow: 'inset 3px 3px 9px rgba(163,177,194,0.7), inset -2px -2px 7px rgba(255,255,255,0.85)',
          }}
        >
          {/* Avatar */}
          <div
            className="w-[36px] h-[36px] min-w-[36px] rounded-[10px] flex items-center justify-center text-white flex-shrink-0"
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: '12.5px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #C8102E, #E8821A)',
              boxShadow: '2px 2px 6px rgba(200,16,46,0.3)',
            }}
          >
            {initials}
          </div>

          {/* User info */}
          <div
            className="overflow-hidden whitespace-nowrap transition-all duration-[380ms]"
            style={{
              opacity:  collapsed ? 0  : 1,
              maxWidth: collapsed ? 0  : 180,
              transitionTimingFunction: 'cubic-bezier(0.77,0,0.18,1)',
            }}
          >
            <p
              className="text-[13px] font-[500] text-[#1C2033]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {user?.username ?? 'Guest User'}
            </p>
            <span className="text-[10.5px] text-[#7A8799]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Administrator · Pro Plan
            </span>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav
          className="flex-1 overflow-y-auto overflow-x-hidden px-[10px] py-[8px]"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(200,16,46,0.22) transparent' }}
        >
          {/* Workspace section */}
          <SectionLabel label="Workspace" collapsed={collapsed} />
          {workspaceItems.map((item) => (
            <NavItem
              key={item.label}
              {...item}
              active={isActive(item.path)}
              collapsed={collapsed}
              onClick={() => item.path && navigate(item.path)}
            />
          ))}

          <SidebarDivider />

          {/* Intelligence section */}
          <SectionLabel label="Intelligence" collapsed={collapsed} />
          {intelligenceItems.map((item) => (
            <NavItem
              key={item.label}
              {...item}
              active={isActive(item.path)}
              collapsed={collapsed}
              onClick={() => item.path && navigate(item.path)}
            />
          ))}

          <SidebarDivider />

          {/* Account section */}
          <SectionLabel label="Account" collapsed={collapsed} />
          {accountItems.map((item) => (
            <NavItem
              key={item.label}
              {...item}
              active={isActive(item.path)}
              collapsed={collapsed}
              onClick={() => item.path && navigate(item.path)}
            />
          ))}
        </nav>

        {/* ── Bottom: AI Status + Logout ── */}
        <div
          className="px-[10px] pb-[18px] pt-[10px]"
          style={{ borderTop: '1px solid rgba(200,16,46,0.1)' }}
        >
          {/* AI Copilot status */}
          <div
            className="flex items-center gap-[8px] rounded-[13px] px-[11px] py-[9px] mb-[8px] overflow-hidden cursor-pointer transition-[background] duration-[180ms]"
            style={{
              background: 'rgba(13,158,110,0.08)',
              border: '1px solid rgba(13,158,110,0.22)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(13,158,110,0.15)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(13,158,110,0.08)';
            }}
          >
            {/* Pulsing dot */}
            <span
              className="w-[8px] h-[8px] min-w-[8px] rounded-full"
              style={{
                background: '#0D9E6E',
                animation: 'aipulse 2s infinite',
              }}
            />
            {/* Status text */}
            <div
              className="overflow-hidden whitespace-nowrap transition-all duration-[380ms]"
              style={{
                opacity:  collapsed ? 0  : 1,
                maxWidth: collapsed ? 0  : 180,
                transitionTimingFunction: 'cubic-bezier(0.77,0,0.18,1)',
              }}
            >
              <p
                className="text-[12px] font-[600] text-[#0D9E6E]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Copilot Active
              </p>
              <span className="text-[10.5px] text-[#7A8799]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Listening for cues...
              </span>
            </div>
          </div>

          {/* Logout */}
          <NavItem
            icon={<LogOut size={16} />}
            label="Log Out"
            active={false}
            collapsed={collapsed}
            onClick={handleLogout}
            muted
          />
        </div>
      </aside>
      </div>{/* end sidebar wrapper */}

      {/* ════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════ */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* ── Top Bar ── */}
        <header
          className="flex items-center justify-between gap-3 flex-wrap px-[36px] py-[18px] flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(163,177,194,0.22)' }}
        >
          {/* Page title */}
          <div
            className="text-[22px] font-[800] text-[#1C2033]"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Good&nbsp;morning,{' '}
            <em
              className="not-italic"
              style={{
                background: 'linear-gradient(135deg, #C8102E, #E8821A, #F5A623)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {user?.username ?? 'there'}
            </em>{' '}
            ✦
          </div>

          {/* Right: Search + Bell + User */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div
              className="flex items-center gap-[9px] rounded-[13px] px-[16px] py-[9px] text-[13px] text-[#7A8799] min-w-[220px] cursor-text transition-[box-shadow] duration-[180ms]"
              style={{
                background: 'var(--color-bg)',
                boxShadow: 'inset 4px 4px 10px rgba(163,177,194,0.7), inset -2px -2px 7px rgba(255,255,255,0.85)',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <Search size={14} className="shrink-0 text-[#7A8799]" />
              <span>Search deals, contacts...</span>
            </div>

            {/* Bell */}
            <button
              className="relative p-[10px] rounded-[12px] border-none outline-none cursor-pointer text-[#4A5568] hover:text-[#C8102E] transition-colors duration-[180ms]"
              style={{
                background: '#E4E9F0',
                boxShadow: '3px 3px 9px rgba(163,177,194,0.7), -2px -2px 7px rgba(255,255,255,0.85)',
              }}
            >
              <Bell size={18} />
              <span
                className="absolute top-[8px] right-[8px] w-[7px] h-[7px] rounded-full border-[1.5px]"
                style={{ background: '#C8102E', borderColor: '#E4E9F0' }}
              />
            </button>

            {/* User chip */}
            <div
              className="flex items-center gap-[10px] pl-[16px]"
              style={{ borderLeft: '1px solid rgba(163,177,194,0.3)' }}
            >
              <div className="flex flex-col items-end">
                <span
                  className="text-[13px] font-[700] text-[#1C2033] uppercase tracking-tight"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  {user?.username ?? 'Guest'}
                </span>
                <span
                  className="text-[10px] font-[600] text-[#C8102E] uppercase tracking-[0.1em]"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  Administrator
                </span>
              </div>
              <div
                className="w-[38px] h-[38px] rounded-[11px] flex items-center justify-center text-white text-[13px] font-[700] flex-shrink-0 cursor-pointer"
                style={{
                  fontFamily: "'Sora', sans-serif",
                  background: 'linear-gradient(135deg, #C8102E, #E8821A)',
                  boxShadow: '3px 3px 9px rgba(163,177,194,0.7), -2px -2px 7px rgba(255,255,255,0.85)',
                }}
              >
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* ── Page Content ── */}
        <div className="flex-1 overflow-y-auto px-[36px] py-[28px]">
          <Outlet />
        </div>
      </main>

      {/* AI pulse keyframes injected globally */}
      <style>{`
        @keyframes aipulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: .6; transform: scale(1.35); }
        }
        nav::-webkit-scrollbar { width: 3px; }
        nav::-webkit-scrollbar-thumb { background: rgba(200,16,46,0.22); border-radius: 3px; }
      `}</style>
    </div>
  );
};

export default MainLayout;
