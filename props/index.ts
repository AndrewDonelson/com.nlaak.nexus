import { IconType } from 'react-icons';

export interface ThemeAwareLayoutProps {
    children: React.ReactNode;
}

export interface FooterProps {
    startYear?: number;
    companyName: string;
}

export interface LogoProps {
    className?: string;
}
