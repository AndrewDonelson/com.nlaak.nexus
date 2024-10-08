import { LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card";

export interface FeatureCardProps {
    icon: React.ReactElement<LucideIcon>;
    title: string;
    description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
    <Card className="transition-all duration-300 hover:shadow-lg bg-card group animate-fade-in-up hover:scale-105">
        <CardHeader>
            <div className="mb-4 text-primary group-hover:animate-bounce">{icon}</div>
            <CardTitle className="text-card-foreground group-hover:text-primary transition-colors duration-200">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <CardDescription className="text-card-foreground/80 group-hover:text-card-foreground transition-colors duration-200">{description}</CardDescription>
        </CardContent>
    </Card>
);