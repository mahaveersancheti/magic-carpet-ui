import React, { useMemo } from 'react';
import NeomorphicCard from '../../components/NeomorphicCard';
import { Users, Package, TrendingUp, Briefcase } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   Stat Card — Magic Carpet brand colours
────────────────────────────────────────────────────────────── */
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconBg: string;   // tailwind bg-* or inline style colour
  iconColor: string; // text-* colour
  accent?: 'red' | 'orange' | 'dark' | 'none';
}

const StatCard: React.FC<StatCardProps> = React.memo(
  ({ icon, label, value, iconBg, iconColor, accent = 'none' }) => (
    <NeomorphicCard accent={accent} className="flex items-center gap-5">
      <div
        className={`w-14 h-14 neo-inset rounded-2xl flex items-center justify-center flex-shrink-0 ${iconColor}`}
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="eyebrow text-[10px]">{label}</span>
        <span className="font-sora text-2xl font-black text-[#1A1A1A] leading-tight">{value}</span>
      </div>
    </NeomorphicCard>
  )
);

/* ─────────────────────────────────────────────────────────────
   Recent Request Row
────────────────────────────────────────────────────────────── */
interface RequestRowProps {
  initials: string;
  name: string;
  role: string;
  priority: 'HIGH' | 'MED' | 'LOW';
}

const priorityStyles: Record<string, string> = {
  HIGH: 'text-[#C1272D] bg-[rgba(193,39,45,0.1)]',
  MED:  'text-[#F7941D] bg-[rgba(247,148,29,0.1)]',
  LOW:  'text-[#777]   bg-[rgba(119,119,119,0.1)]',
};

const RequestRow: React.FC<RequestRowProps> = React.memo(
  ({ initials, name, role, priority }) => (
    <div className="p-4 neo-inset rounded-2xl flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-sora font-black text-sm text-white"
          style={{ background: 'linear-gradient(135deg, #C1272D, #F7941D)' }}
        >
          {initials}
        </div>
        <div className="flex flex-col">
          <span className="font-sora text-sm font-bold text-[#1A1A1A]">{name}</span>
          <span className="text-[10px] text-[#777] uppercase font-bold tracking-widest">{role}</span>
        </div>
      </div>
      <span
        className={`text-[10px] font-bold font-sora px-3 py-1 rounded-full ${priorityStyles[priority]}`}
      >
        {priority} PRIORITY
      </span>
    </div>
  )
);

/* ─────────────────────────────────────────────────────────────
   Status Bar
────────────────────────────────────────────────────────────── */
interface StatusBarProps {
  label: string;
  valueLabel: string;
  valueLabelColor: string;
  fillWidth: string;
  fillGradient: string;
}

const StatusBar: React.FC<StatusBarProps> = React.memo(
  ({ label, valueLabel, valueLabelColor, fillWidth, fillGradient }) => (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-[10px] font-bold font-sora uppercase tracking-[2px]">
        <span className="text-[#777]">{label}</span>
        <span style={{ color: valueLabelColor }}>{valueLabel}</span>
      </div>
      <div className="h-3 neo-inset rounded-full p-[3px] overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: fillWidth, background: fillGradient }}
        />
      </div>
    </div>
  )
);

/* ─────────────────────────────────────────────────────────────
   Dashboard Home
────────────────────────────────────────────────────────────── */
const DashboardHome: React.FC = () => {
  const stats = useMemo(
    () => [
      {
        icon: <Package size={22} />,
        label: 'Total Products',
        value: '12',
        iconBg: 'rgba(193,39,45,0.12)',
        iconColor: 'text-[#C1272D]',
        accent: 'red' as const,
      },
      {
        icon: <Users size={22} />,
        label: 'Active Leads',
        value: '1,280',
        iconBg: 'rgba(247,148,29,0.12)',
        iconColor: 'text-[#F7941D]',
        accent: 'orange' as const,
      },
      {
        icon: <TrendingUp size={22} />,
        label: 'Conv. Rate',
        value: '24.8%',
        iconBg: 'rgba(193,39,45,0.10)',
        iconColor: 'text-[#C1272D]',
        accent: 'red' as const,
      },
      {
        icon: <Briefcase size={22} />,
        label: 'Opportunities',
        value: '48',
        iconBg: 'rgba(247,148,29,0.10)',
        iconColor: 'text-[#F7941D]',
        accent: 'orange' as const,
      },
    ],
    []
  );

  const recentRequests: RequestRowProps[] = useMemo(
    () => [
      { initials: 'JD', name: 'Jane Doe',      role: 'VP Sales, Acme Corp',       priority: 'HIGH' },
      { initials: 'MS', name: 'Mark Spencer',  role: 'CRO, NovaSoft Solutions',   priority: 'MED'  },
      { initials: 'AR', name: 'Alice Roberts', role: 'Head of Revenue, BlueHive',  priority: 'LOW'  },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-1">
        <div className="eyebrow">Magic Carpet · AI Copilot</div>
        <h2 className="font-sora text-3xl font-black text-[#1A1A1A] leading-tight">
          Dashboard<span className="text-[#C1272D]">.</span>
        </h2>
        <p className="font-dm text-sm text-[#777]">
          Welcome back — your prospect intelligence is ready.
        </p>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* ── Lower Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent intelligence requests */}
        <NeomorphicCard accent="red" className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h3 className="font-sora text-base font-black uppercase tracking-tight text-[#1A1A1A]">
              Recent Intelligence Requests
            </h3>
            <span className="eyebrow text-[10px]">Live</span>
          </div>
          <div className="flex flex-col gap-3">
            {recentRequests.map((r) => (
              <RequestRow key={r.name} {...r} />
            ))}
          </div>
        </NeomorphicCard>

        {/* System status */}
        <NeomorphicCard accent="orange" className="flex flex-col gap-5">
          <h3 className="font-sora text-base font-black uppercase tracking-tight text-[#1A1A1A]">
            System Status
          </h3>
          <div className="flex flex-col gap-5">
            <StatusBar
              label="AI Intelligence Depth"
              valueLabel="98% Efficient"
              valueLabelColor="#C1272D"
              fillWidth="98%"
              fillGradient="linear-gradient(90deg, #C1272D, #F7941D)"
            />
            <StatusBar
              label="Data Source Connectivity"
              valueLabel="Live & Stable"
              valueLabelColor="#1A6B1A"
              fillWidth="95%"
              fillGradient="linear-gradient(90deg, #1A6B1A, #2ead2e)"
            />
            <StatusBar
              label="Voice Readiness"
              valueLabel="Ready"
              valueLabelColor="#F7941D"
              fillWidth="100%"
              fillGradient="linear-gradient(90deg, #F7941D, #fbb84d)"
            />
          </div>
        </NeomorphicCard>
      </div>
    </div>
  );
};

export default DashboardHome;
