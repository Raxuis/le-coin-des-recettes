export default defineNuxtRouteMiddleware((to) => {
    const { status } = useAuth();
    console.log('Auth Status:', status.value);
    const excludedPaths = [
        '/auth/signIn',
        '/about',
        '/',
        '/recipes',
        '/special-events-recipes',
        '/community'
    ];
    const excludedNames = ['recipe-slug'];

    console.log('Navigating to:', to.path);
    console.log('Route meta:', to.meta);

    if (excludedPaths.includes(to.path) || excludedNames.includes(to.name as string)) {
        if (status.value === 'authenticated' && to.meta?.auth?.unauthenticatedOnly) {
            return navigateTo(to.meta.auth.navigateAuthenticatedTo || '/profile');
        }
        return;
    }

    if (status.value !== 'authenticated') {
        return navigateTo(to.meta?.auth?.navigateUnauthenticatedTo || '/auth/signIn');
    }
});
