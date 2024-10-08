import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface NavigateToProps {
  route: string;
}

export const NavigateTo: React.FC<NavigateToProps> = ({ route }) => {
  const router = useRouter();

  useEffect(() => {
    router.push(route);
  }, [route, router]);

  return null;
};