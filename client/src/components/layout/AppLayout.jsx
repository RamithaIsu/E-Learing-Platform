import * as Dialog from '@radix-ui/react-dialog';
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Plus,
  Presentation,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet, ScrollRestoration, useNavigation } from 'react-router';
import { APP_CONFIG } from '../../config/app';
import { cn } from '../../lib/cn';
import { ButtonLink } from '../ui/Button';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/courses', label: 'Courses', icon: BookOpen },
  { to: '/instructors', label: 'Instructors', icon: Presentation },
  { to: '/students', label: 'Students', icon: GraduationCap },
  { to: '/enrollments', label: 'Enrollments', icon: ClipboardList },
];

function Logo({ inverted = false }) {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 rounded-lg"
      aria-label={`${APP_CONFIG.name} home`}
    >
      <img src="/favicon.svg" alt="" className="size-9" />
      <span className="leading-tight">
        <span
          className={cn(
            'block font-display text-lg font-semibold',
            inverted ? 'text-white' : 'text-ink',
          )}
        >
          {APP_CONFIG.name}
        </span>
        <span className={cn('block text-xs', inverted ? 'text-brand-200' : 'text-ink-subtle')}>
          {APP_CONFIG.tagline}
        </span>
      </span>
    </Link>
  );
}

function NavList({ onNavigate }) {
  return (
    <ul className="space-y-1">
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <li key={to}>
          <NavLink
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-white/12 text-white shadow-[inset_3px_0_0_var(--color-accent-300)]'
                  : 'text-brand-100/80 hover:bg-white/6 hover:text-white',
              )
            }
          >
            <Icon className="size-4.5" aria-hidden="true" />
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

function SidebarContent({ onNavigate }) {
  return (
    <div className="flex h-full flex-col gap-8 px-4 py-6">
      <div className="px-2">
        <Logo inverted />
      </div>
      <nav aria-label="Main" className="flex-1">
        <NavList onNavigate={onNavigate} />
      </nav>
      <div className="rounded-2xl bg-white/6 p-4 ring-1 ring-white/10">
        <p className="font-display text-base font-semibold text-white">Launch a new course</p>
        <p className="mt-1 text-xs leading-relaxed text-brand-100/75">
          Add lessons, set seats and publish when you are ready.
        </p>
        <ButtonLink
          to="/courses/new"
          variant="accent"
          size="sm"
          className="mt-3 w-full"
          onClick={onNavigate}
        >
          <Plus /> New course
        </ButtonLink>
      </div>
    </div>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open navigation menu"
          className="grid size-10 place-items-center rounded-xl text-ink hover:bg-ink/5"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/45 backdrop-blur-[2px] motion-safe:animate-fade-in" />
        <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-[min(19rem,85vw)] bg-brand-950 shadow-pop motion-safe:animate-slide-in">
          <Dialog.Title className="sr-only">Navigation</Dialog.Title>
          <Dialog.Description className="sr-only">
            Go to a section of {APP_CONFIG.name}
          </Dialog.Description>
          <Dialog.Close
            aria-label="Close navigation menu"
            className="absolute top-5 right-4 grid size-9 place-items-center rounded-xl text-brand-100 hover:bg-white/10"
          >
            <X className="size-5" aria-hidden="true" />
          </Dialog.Close>
          <SidebarContent onNavigate={() => setOpen(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function AppLayout() {
  const navigation = useNavigation();

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-surface px-4 py-2 font-semibold focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      {navigation.state === 'loading' && (
        <div
          className="fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden bg-brand-100"
          role="progressbar"
          aria-label="Loading page"
        >
          <div className="h-full w-2/5 bg-accent-400 motion-safe:animate-progress" />
        </div>
      )}

      <aside className="sticky top-0 hidden h-dvh overflow-y-auto bg-brand-950 lg:block">
        <SidebarContent />
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-canvas/85 px-4 backdrop-blur sm:px-6 lg:hidden">
          <Logo />
          <MobileNav />
        </header>
        <main
          id="main"
          className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10"
        >
          <Outlet />
        </main>
      </div>
      <ScrollRestoration />
    </div>
  );
}
