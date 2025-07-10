import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthRoutes';
import { useAuthStore } from '@/stores/auth';

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/:pathMatch(.*)*',
            component: () => import('@/views/authentication/Error.vue')
        },
        MainRoutes,
        AuthRoutes
    ],
    scrollBehavior(to, from, savedPosition) {
    // Scroll to top on route change
        return { top: 0, behavior: 'smooth' }; // 'smooth' makes the scroll gradual
    }
});

router.beforeEach(async (to, from, next) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/login', '/register'];
    const authRequired = !publicPages.includes(to.path);
    const auth: any = useAuthStore();
    if (to.matched.some((record) => record.meta.requiresAuth)) { // main routes
        // if (authRequired && !auth.userat) {
        var auth_response = await auth.authenticate(to.meta.rolereq)
        if (auth_response === 'NOTALLOWED')
        {
            if (localStorage.getItem('role') == "customer")   return router.push('/customer-dashboard');
            if (localStorage.getItem('role') == "vendor")     return router.push('/vendor-dashboard');
            if (localStorage.getItem('role') == "admin")      return router.push('/admin-dashboard');
        }
        else if (authRequired && !(auth_response)) {
            auth.returnUrl = to.fullPath;
            // return next();
            return router.push('/login')
        } else next();
    } else { // auth routes
        if (!authRequired) // going to a public page
        {   
            if (localStorage.getItem('user')) 
            {   if (await auth.authenticate()) { 
                    if (localStorage.getItem('role') == "customer")   return router.push('/customer-dashboard');
                    if (localStorage.getItem('role') == "vendor")     return router.push('/vendor-dashboard');
                    if (localStorage.getItem('role') == "admin")      return router.push('/admin-dashboard');
            }   }
            next();
        }
        else { next(); }
        
    }

});
