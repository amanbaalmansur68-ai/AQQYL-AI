import { Redirect } from 'expo-router';
import { useUserStore } from '../store';

export default function Index() {
    const { isAuthenticated, role } = useUserStore();

    // Redirect based on authentication and role
    if (isAuthenticated) {
        if (role === 'teacher') {
            return <Redirect href="/(teacher)/dashboard" />;
        } else if (role === 'student') {
            return <Redirect href="/(student)/join" />;
        }
    }

    return <Redirect href="/(auth)/welcome" />;
}
