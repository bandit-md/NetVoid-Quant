import Link from 'next/link';
import type { ReactNode } from 'react';

export function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Stat({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: ReactNode; tone?: 'good' | 'bad' }) {
  return (
    <div className="card card-pad">
      <div className="label">{label}</div>
      <div className="num mt-2 text-2xl">{value}</div>
      {sub != null && <div className={`num mt-1 text-xs ${tone === 'good' ? 'text-good' : tone === 'bad' ? 'text-bad' : 'text-muted'}`}>{sub}</div>}
    </div>
  );
}

export function Section({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="card">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <h2 className="text-sm font-medium">{title}</h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="py-8 text-center text-sm text-muted">{children}</div>;
}

export function Tone({ value, children }: { value: number | null | undefined; children: ReactNode }) {
  const tone = value == null ? '' : value >= 0 ? 'text-good' : 'text-bad';
  return <span className={tone}>{children}</span>;
}
