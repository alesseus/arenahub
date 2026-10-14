import type { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement>;

function Icona({ children, ...props }: Props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            {children}
        </svg>
    );
}

export function ArrowRight(props: Props) {
    return (
        <Icona {...props}>
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </Icona>
    );
}

export function CalendarDays(props: Props) {
    return (
        <Icona {...props}>
            <path d="M8 2v3" />
            <path d="M16 2v3" />
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18" />
            <path d="M8 13h.01" />
            <path d="M12 13h.01" />
            <path d="M16 13h.01" />
            <path d="M8 17h.01" />
            <path d="M12 17h.01" />
            <path d="M16 17h.01" />
        </Icona>
    );
}

export function ChartNoAxesColumn(props: Props) {
    return (
        <Icona {...props}>
            <path d="M5 21v-6" />
            <path d="M12 21V3" />
            <path d="M19 21V9" />
        </Icona>
    );
}

export function CircleDot(props: Props) {
    return (
        <Icona {...props}>
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="12" r="10" />
        </Icona>
    );
}

export function Flag(props: Props) {
    return (
        <Icona {...props}>
            <path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528" />
        </Icona>
    );
}

export function House(props: Props) {
    return (
        <Icona {...props}>
            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
            <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </Icona>
    );
}

export function LayoutDashboard(props: Props) {
    return (
        <Icona {...props}>
            <rect width="7" height="9" x="3" y="3" rx="1" />
            <rect width="7" height="5" x="14" y="3" rx="1" />
            <rect width="7" height="9" x="14" y="12" rx="1" />
            <rect width="7" height="5" x="3" y="16" rx="1" />
        </Icona>
    );
}

export function LogIn(props: Props) {
    return (
        <Icona {...props}>
            <path d="m10 17 5-5-5-5" />
            <path d="M15 12H3" />
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        </Icona>
    );
}

export function LogOut(props: Props) {
    return (
        <Icona {...props}>
            <path d="m16 17 5-5-5-5" />
            <path d="M21 12H9" />
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        </Icona>
    );
}

export function Moon(props: Props) {
    return (
        <Icona {...props}>
            <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
        </Icona>
    );
}

export function Pencil(props: Props) {
    return (
        <Icona {...props}>
            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
            <path d="m15 5 4 4" />
        </Icona>
    );
}

export function Plus(props: Props) {
    return (
        <Icona {...props}>
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </Icona>
    );
}

export function Settings2(props: Props) {
    return (
        <Icona {...props}>
            <path d="M14 17H5" />
            <path d="M19 7h-9" />
            <circle cx="17" cy="17" r="3" />
            <circle cx="7" cy="7" r="3" />
        </Icona>
    );
}

export function Sun(props: Props) {
    return (
        <Icona {...props}>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
        </Icona>
    );
}

export function Trophy(props: Props) {
    return (
        <Icona {...props}>
            <path d="M10 14.66V17a1 1 0 0 1-1 1 2 2 0 0 0-2 2v2" />
            <path d="M14 14.66V17a1 1 0 0 0 1 1 2 2 0 0 1 2 2v2" />
            <path d="M17.916 10H19.5A2.5 2.5 0 0 0 22 7.5V5a1 1 0 0 0-1-1h-3" />
            <path d="M4 22h16" />
            <path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z" />
            <path d="M6.084 10H4.5A2.5 2.5 0 0 1 2 7.5V5a1 1 0 0 1 1-1h3" />
        </Icona>
    );
}

export function UserRound(props: Props) {
    return (
        <Icona {...props}>
            <circle cx="12" cy="8" r="5" />
            <path d="M20 21a8 8 0 0 0-16 0" />
        </Icona>
    );
}

export function Users(props: Props) {
    return (
        <Icona {...props}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <path d="M16 3.128a4 4 0 0 1 0 7.744" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <circle cx="9" cy="7" r="4" />
        </Icona>
    );
}
