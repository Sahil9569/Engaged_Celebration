const AuthRoutes = {
    path: '/auth',
    component: () => import('@/layouts/blank/BlankLayout.vue'),
    meta: {
        requiresAuth: false,
    },
    children: [
        {
            name: 'Landing Page',
            path: '/',
            component: () => import('@/views/pages/landingpage/index.vue')
        },
        {
            name: 'About Us',
            path: '/about',
            component: () => import('@/views/pages/about/about_page.vue')
        },
        {
            name: 'Privacy Policy',
            path: '/privacy-policy',
            component: () => import('@/views/pages/privacy-policy/privacy_policy.vue')
        },
        {
            name: 'Contact',
            path: '/contact',
            component: () => import('@/views/pages/contact/contact.vue')
        },
        {
            name: 'How It Works',
            path: '/how-it-works',
            component: () => import('@/views/pages/how-it-works/how-it-works.vue')
        },
        {
            name: 'For Vendor',
            path: '/for-vendor',
            component: () => import('@/views/pages/for-vendor/for-vendor.vue')
        },
        {
            name: 'Faq',
            path: '/faq',
            component: () => import('@/views/pages/faq/Faq.vue')
        },
        {
            name: 'Customer',
            path: '/customer',
            component: () => import('@/views/pages/vendor/customer.vue')
        },
        {
            name: 'Vendor Single Category',
            path: '/vendor-single-category',
            component: () => import('@/views/pages/vendor/vendor-single-category.vue')
        },
        {
            name: 'Vendor Single',
            path: '/single-vendor',
            component: () => import('@/views/pages/vendor/vendor-single.vue')
        },
        {
            name: 'Blog Single',
            path: '/single-blog',
            component: () => import('@/views/pages/blog/single-blog.vue')
        },
        {
            name: 'Blog Listing',
            path: '/blog-listing',
            component: () => import('@/views/pages/blog/blog-listing.vue')
        },
        {
            name: 'Side Login',
            path: '/auth/login',
            component: () => import('@/views/authentication/SideLogin.vue')
        },
        {
            name: 'Boxed Login',
            path: '/login',
            component: () => import('@/views/authentication/BoxedLogin.vue')
        },
        {
            name: 'Side Register',
            path: '/auth/register',
            component: () => import('@/views/authentication/SideRegister.vue')
        },
        {
            name: 'Boxed Register',
            path: '/register',
            component: () => import('@/views/authentication/BoxedRegister.vue')
        },
        {
            name: 'Side Forgot Password',
            path: '/forgot-password',
            component: () => import('@/views/authentication/SideForgotPassword.vue')
        },
        {
            name: 'Boxed Forgot Password',
            path: '/auth/forgot-password2',
            component: () => import('@/views/authentication/BoxedForgotPassword.vue')
        },
        {
            name: 'Side Two Steps',
            path: '/auth/two-step',
            component: () => import('@/views/authentication/SideTwoStep.vue')
        },
        {
            name: 'Boxed Two Steps',
            path: '/auth/two-step2',
            component: () => import('@/views/authentication/BoxedTwoStep.vue')
        },
        {
            name: 'Error',
            path: '/auth/404',
            component: () => import('@/views/authentication/Error.vue')
        },
        {
            name: 'Maintenance',
            path: '/auth/maintenance',
            component: () => import('@/views/authentication/Maintenance.vue')
        },
        {
            name: 'Thankyou',
            path: '/payment_success',
            component: () => import('@/views/vendorModule/thankyou/thankyou.vue'),
        },
        {
            name: 'Payment_Thankyou',
            path: '/payment_success_thankyou',
            component: () => import('@/views/vendorModule/thankyou/payment_thankyou.vue'),
        },
        {
            name: 'search',
            path: '/search',
            component: () => import('@/views/pages/search/search.vue')
        },
        {
            name: 'cpackage Single',
            path: '/cpackage_pub/:id',
            component: () => import('@/views/customer/vendor/cpacksinglepub.vue'),
        },
        {
            name: 'All Package Listing',
            path: '/allpackagelisting',
            component: () => import('@/views/pages/all-packages/allpackagelisting.vue')
        },
        {
            name: 'AllPackageListingWithParams',
            path: '/:searchloc/:searchcat/:searchbud?',
            component: () => import('@/views/pages/all-packages/allpackagelisting.vue')
        },
        {
            name: 'Booking Thankyou',
            path: '/booking_success',
            component: () => import('@/views/pages/thankyou/booking-thankyou.vue')
        },
        {
            name: 'Subscriptions Thankyou',
            path: '/subscriptions_success',
            component: () => import('@/views/pages/thankyou/booking-thankyou.vue')
        },
        // {
        //     name: 'Report Single',
        //     path: '/report-single/:id',
        //     component: () => import('@/views/adminModule/pack-report/report-single.vue'),
        //     // meta: { rolereq: null }
        //     // '/cpackage_pub/:id',
        // },
        
    ]
};

export default AuthRoutes;
