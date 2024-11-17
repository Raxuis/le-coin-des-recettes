export default defineNuxtRouteMiddleware((to) => {
    const { status } = useAuth();

    const excludedPaths = [
        '/auth/signIn',
        '/about',
        '/',
        '/recipes',
        '/special-events-recipes',
        '/community'
    ];

    const excludedNames = ['recipe-slug'];

    if (excludedPaths.includes(to.path) || excludedNames.includes(to.name as string)) {
        if (status.value === 'authenticated' && to.meta.auth?.unauthenticatedOnly) {
            return navigateTo(to.meta.auth?.navigateAuthenticatedTo || '/profile');
        }
        return;
    }

    // Redirect unauthenticated users for protected routes
    if (status.value !== 'authenticated') {
        return navigateTo(to.meta.auth?.navigateUnauthenticatedTo || '/auth/signIn');
    }
});
