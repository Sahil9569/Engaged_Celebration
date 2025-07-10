const MainRoutes = {
    path: '/main',
    meta: {
        requiresAuth: true
    },
    redirect: '/main',
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
        {
            name: 'Customer Dashboard',
            path: '/customer-dashboard',
            component: () => import('@/views/customer/dashboard/dashboard.vue'),
            meta: { rolereq: 'customer' }
        },

        {
            name: 'Email Inbox',
            path: '/customer-emails',
            component: () => import('@/views/customer/emaildata/cust-email.vue'),
            meta: { rolereq: 'customer' }
        },

        {
            name: 'Customer Bookings',
            path: '/all-bookings',
            component: () => import('@/views/customer/bookings/all-bookings.vue'),
            meta: { rolereq: 'customer' }
        },
        {
            name: 'Customer Multiple Bookings',
            path: '/multiple-booking',
            component: () => import('@/views/customer/bookings/multiple-booking.vue'),
            meta: { rolereq: 'customer' }
        },
        {
            name: 'Booking Single',
            path: '/booking-single/:pk',
            component: () => import('@/views/customer/bookings/booking-single.vue'),
            meta: { rolereq: null }
        },
        {
            name: 'Booking Single Admin',
            path: '/booking-single-admin/:pk',
            component: () => import('@/views/customer/bookings/booking-single.vue'),
            meta: { rolereq: null }
        },

        {
            name: 'Transactions',
            path: '/transactions',
            component: () => import('@/views/customer/transaction/transactions.vue'),
            meta: { rolereq: 'customer' }
        },
        {
            name: 'Transaction  Single',
            path: '/transaction-single',
            component: () => import('@/views/customer/invoices/invoice.vue'),

            meta: { rolereq: null }
        },
        {
            name: 'Reviews',
            path: '/reviews',
            component: () => import('@/views/customer/reviews/reviews.vue'),
            meta: { rolereq: 'customer' }
        },
        {
            name: 'Single service',
            path: '/single_service/:pk',
            component: () => import('@/views/customer/vendor/vendor-listing.vue'),
            meta: { rolereq: 'customer' }
        },
        {
            name: 'Vendors Single',
            path: '/vendor-single/:id',
            component: () => import('@/views/customer/vendor/vendor-single.vue'),
            meta: { rolereq: null }
        },
        {
            name: 'Vendors Single Admin',
            path: '/vendor-single_admin/:id',
            component: () => import('@/views/customer/vendor/vendor-single.vue'),
            meta: { rolereq: 'customer' }
        },

        {
            name: 'Couple Chats',
            path: '/cchats',
            component: () => import('@/views/customer/chats/chats.vue'),
            meta: { rolereq: 'customer' }
        },

        {
            name: 'Account Settings',
            path: '/account-settings',
            component: () => import('@/views/customer/account-setting/account-setting.vue'),
            meta: { rolereq: 'customer' }
        },

        {
            name: 'Invoice',
            path: '/invoice',
            component: () => import('@/views/customer/invoices/invoice.vue'),
            meta: { rolereq: 'customer' }
        },
        {
            name: 'Contracts',
            path: '/contracts',
            component: () => import('@/views/customer/contract/contract.vue'),
            meta: { rolereq: null }
        },
        {
            name: 'Customer Contract Single',
            path: '/contract-single',
            component: () => import('@/views/customer/contract/contract-single.vue'),
            meta: { rolereq: 'customer' }
        },
        {
            name: 'Vendor Category',
            path: '/vendor-category',
            component: () => import('@/views/customer/vendor/vendor-category.vue'),
            meta: { rolereq: 'customer' }
        },

        {
            name: 'Modern',
            path: '/dashboards/modern',
            component: () => import('@/views/dashboard/modern/index.vue'),
            meta: { rolereq: 'customer' }
        },
        {
            name: 'Customer Wishlist',
            path: '/wishlist',
            component: () => import('@/views/customer/couple-wishlist/wish-data.vue'),
            meta: { rolereq: 'customer' }
        },

        // Vendor Routing Start
        {
            name: 'Dashboard Vendor',
            path: '/vendor-dashboard',
            component: () => import('@/views/vendorModule/Dashboard.vue'),
            meta: { rolereq: 'vendor' }
        },
        // {
        //     name: 'Onboarding',
        //     path: '/onboard',
        //     component: () => import('@/views/vendorModule/onboarding.vue'),
        //     meta: { rolereq: 'vendor' }
        // },
        {
            name: 'Vendor Chats',
            path: '/vchats',
            component: () => import('@/views/vendorModule/chats/chats.vue'),
            meta: { rolereq: 'vendor' }
        },
        {
            name: 'All Bookings',
            path: '/vendor-bookings',
            component: () => import('@/views/vendorModule/bookings/all-bookings.vue'),
            meta: { rolereq: 'vendor' }
        },
        {
            name: 'Close Bookings',
            path: '/close-bookings',
            component: () => import('@/views/vendorModule/bookings/close-bookings.vue'),
            meta: { rolereq: 'vendor' }
        },
        {
            name: 'Admin Close Booking Single',
            path: '/admin-c_booking-single-action/:action/:pk',
            // path: '/booking-single/:pk',
            component: () => import('@/views/vendorModule/bookings/close-booking-single.vue'),
            meta: { rolereq: null }
        },

        {
            name: 'Vendor Booking Single',
            path: '/vendor-booking-single/:pk',
            // path: '/booking-single/:pk',
            component: () => import('@/views/vendorModule/bookings/booking-single.vue'),
            meta: { rolereq: null }
        },
        {
            name: 'Vendor Booking Single',
            path: '/vendor-booking-single-action/:action/:pk',
            // path: '/booking-single/:pk',
            component: () => import('@/views/vendorModule/bookings/booking-single.vue'),
            meta: { rolereq: null }
        },
        {
            name: 'Packages',
            path: '/packages',
            component: () => import('@/views/vendorModule/packages/packages-listing.vue'),
            meta: { rolereq: 'vendor' }
        },
        {
            name: 'Add packages',
            path: '/add-package',
            component: () => import('@/views/vendorModule/packages/add-package.vue'),
            meta: { rolereq: 'vendor' }
        },
        {
            name: 'Edit packages',
            path: '/edit-package/:pk',
            component: () => import('@/views/vendorModule/packages/add-package.vue'),
            meta: { rolereq: null }
        },
        {
            // should have an api directly
            name: 'Delete packages',
            path: '/del-package/:pk',
            component: () => import('@/views/vendorModule/packages/add-package.vue'),
            meta: { rolereq: 'vendor' }
        },
        {
            name: 'Vendor Transactions',
            path: '/manage-transactions',
            component: () => import('@/views/vendorModule/Transactions/Transactions.vue'),
            meta: { rolereq: null }
        },
        {
            name: 'Package add',
            path: '/dummy',
            component: () => import('@/views/vendorModule/packages/packadddummy.vue'),
            meta: { rolereq: 'vendor' }
        },
        {
            name: 'Vendor Profile Settings',
            path: '/profile-settings/',
            component: () => import('@/views/vendorModule/profile/profile-setting.vue'),
            meta: { rolereq: 'vendor' }
        },
        {
            name: 'Vendor Profile Settings with tab',
            path: '/profile-settings/:tab',
            component: () => import('@/views/vendorModule/profile/profile-setting.vue'),
            meta: { rolereq: 'vendor' }
        },
        {
            name: 'Vendor Profile',
            path: '/profile',
            component: () => import('@/views/vendorModule/profile/profile.vue'),
            meta: { rolereq: 'vendor' }
        },
        {
            // for public login like admin or couple
            name: 'Any Vendor Profile',
            path: '/vendor-profile/:id',
            component: () => import('@/views/vendorModule/profile/pubprofile.vue'),
            meta: { rolereq: null }
        },
        {
            name: 'Vendor Transactions',
            path: '/manage-transaction',
            component: () => import('@/views/vendorModule/transaction/transactions.vue'),
            meta: { rolereq: null }
        },
        {
            name: 'Vendor invoices',
            path: '/vendor-invoice/:pk',
            component: () => import('@/views/customer/transaction/transaction-single.vue'),
            meta: { rolereq: null }
        },
        {
            name: 'Reporting',
            path: '/reporting',
            component: () => import('@/views/vendorModule/report/reporting.vue'),
            meta: { rolereq: 'vendor' }
        },
        {
            name: 'Ratings Listing',
            path: '/ratings-listing',
            component: () => import('@/views/vendorModule/ratings/ratings-listing.vue'),
            meta: { rolereq: null }
        },
        {
            name: 'Vendor Rating Single',
            path: '/rating-single/:pk',
            component: () => import('@/views/vendorModule/ratings/rating-single.vue'),
            meta: { rolereq: null }
        },
        {
            name: 'Vendor Contract listing',
            path: '/vendor-contract-listing',
            component: () => import('@/views/vendorModule/contract/contract.vue'),
            meta: { rolereq: 'vendor' }
        },
        {
            name: 'Vendor Contract templates',
            path: '/vendor-contract-templates',
            component: () => import('@/views/vendorModule/contract/contract-templates.vue'),
            meta: { rolereq: 'vendor' }
        },
        {
            name: 'Vendor Contract',
            path: '/vendor-contract-single/:pk',
            component: () => import('@/views/vendorModule/contract/contract-single.vue'),
            meta: { rolereq: null }
        },
        {
            name: 'Admin Contract',
            path: '/admin-contract-single/:pk',
            component: () => import('@/views/vendorModule/contract/admin_single_contract.vue'),
            meta: { rolereq: null }
        },
        {
            name: 'Vendor Calender',
            path: '/calender',
            component: () => import('@/views/vendorModule/calendar/calender.vue'),
            meta: { rolereq: null }
        },
        {
            name: 'Manage Payments',
            path: '/manage-payments',
            component: () => import('@/views/vendorModule/Transactions/manage-payments.vue'),
            meta: { rolereq: null }
        },
        {
            name: 'Wallet Payments',
            path: '/wallet-payment',
            component: () => import('@/views/vendorModule/Transactions/wallet-payment.vue'),
            meta: { rolereq: null }
        },
        {
            name: 'Manage Payments Single',
            path: '/manage-payment-single/:pk',
            component: () => import('@/views/vendorModule/Transactions/manage-payment-single.vue'),
            meta: { rolereq: null }
        },
        {
            name: 'Cumulative Amount',
            path: '/cumulative-amount',
            component: () => import('@/views/vendorModule/transaction/cumulative.vue'),
            meta: { rolereq: null }
        },
        {
            name: 'Vendor Email Inbox',
            path: '/vendor-email',
            component: () => import('@/views/vendorModule/ven-mail-data/ven-email.vue'),
            meta: { rolereq: 'vendor' }
        },






        // admin routing start
        {
            name: 'Admin Dashboard',
            path: '/admin-dashboard',
            component: () => import('@/views/adminModule/dashboard/admin-dashboard.vue'),
            meta: { rolereq: 'admin' }
        },
        {
            name: 'Admin chats',
            path: '/achats',
            component: () => import('@/views/adminModule/chat/chats.vue'),
            meta: { rolereq: 'admin' }
        },
        {
            name: 'Internal Booking',
            path: '/internal-booking',
            component: () => import('@/views/adminModule/booking/internal-booking/internal-booking.vue'),
            meta: { rolereq: 'admin' }
        },
        // {
        //     name: 'Admin Booking Single',
        //     path: '/admin-booking-single',
        //     component: () => import('@/views/adminModule/booking/internal-booking/admin-booking-single.vue'),
        //     meta: { rolereq: 'admin' }
        // },
        {
            name: 'Admin Booking Single',
            path: '/admin-booking-single-action/:action/:pk',
            // path: '/booking-single/:pk',
            component: () => import('@/views/adminModule/booking/internal-booking/admin-booking-single.vue'),
            meta: { rolereq: 'admin' }
        },

        {
            name: 'Open Platform Booking',
            path: '/open-platform-booking',
            component: () => import('@/views/adminModule/booking/open-plateform-booking/open-platform-booking.vue'),
            meta: { rolereq: 'admin' }
        },
        {
            name: 'Open Plateform Booking Single',
            path: '/open-plateform-booking-single',
            component: () => import('@/views/adminModule/booking/open-plateform-booking/open-plateform-booking-single.vue'),
            meta: { rolereq: 'admin' }
        },
        {
            name: 'e',
            path: '/contract-single',
            component: () => import('@/views/adminModule/booking/open-plateform-booking/contract-single.vue'),
            meta: { rolereq: 'admin' }
        },
        {
            name: 'Admin Package Listing',
            path: '/admin-package-listing',
            component: () => import('@/views/adminModule/packages/packages-listing.vue'),
            meta: { rolereq: 'admin' }
        },
        {
            name: 'Admin Add Package',
            path: '/admin-add-package',
            component: () => import('@/views/adminModule/packages/packadddummy.vue'),
            meta: { rolereq: 'admin' }
        },
        {
            name: 'Admin Edit packages',
            path: '/admin-edit-package/:pk',
            component: () => import('@/views/adminModule/packages/packadddummy.vue'),
            meta: { rolereq: 'admin' }
        },

        {
            name: 'Vendors',
            path: '/admin-vendors',
            component: () => import('@/views/adminModule/vendors/vendor-listing.vue'),
            meta: { rolereq: 'admin' }
        },
        {
            name: 'Couples',
            path: '/admin-couples',
            component: () => import('@/views/adminModule/couples/couples.vue'),
            meta: { rolereq: 'admin' }
        },
        {
            name: 'Couple Single',
            path: '/couple-single/:id',
            component: () => import('@/views/adminModule/couples/couple-single.vue'),
            meta: { rolereq: 'admin' }
        },
        {
            name: 'Admin Reports',
            path: '/admin-reports',
            component: () => import('@/views/adminModule/adminreports/reports.vue'),
            meta: { rolereq: 'admin' }
        },
        {
            name: 'Admin Reports with tab',
            path: '/admin-reports/:tab',
            component: () => import('@/views/adminModule/adminreports/reports.vue'),
            meta: { rolereq: 'admin' }
        },
        {
            name: 'Ratings',
            path: '/ratings',
            component: () => import('@/views/adminModule/ratings/ratings.vue'),
            meta: { rolereq: 'admin' }
        },
        {
            name: 'Rating Single',
            path: '/ratings-single',
            component: () => import('@/views/adminModule/ratings/rating-single.vue'),
            meta: { rolereq: 'admin' }
        },
        {
            name: 'Account Setting',
            path: '/admin-account-setting',
            component: () => import('@/views/adminModule/account-setting/admin-account-setting.vue'),
            meta: { rolereq: 'admin' }
        },
        {
            name: 'Subscription',
            path: '/subscription',
            component: () => import('@/views/adminModule/subscription/subscription.vue'),
            meta: { rolereq: 'admin' }
        },
        {
            name: 'Admin Calender',
            path: '/admin-calender',
            component: () => import('@/views/adminModule/calendar/calender.vue'),
            meta: { rolereq: 'admin' }
        },
        {
            name: 'Notifications',
            path: '/notifications',
            component: () => import('@/views/all-notification/notification.vue'),
            meta: { rolereq: null }
        },
        {
            name: 'Website Data',
            path: '/website-data',
            component: () => import('@/views/adminModule/website-data/website-data.vue'),
            meta: { rolereq: null }
        },
        {
            name: 'Vendor Single Mail',
            path: '/vendor-single-mail/:id',
            component: () => import('@/views/adminModule/email/single_vendor_email.vue'),
            meta: { rolereq: null }
        },
        {
            name: 'All Mails',
            path: '/admin-emails',
            component: () => import('@/views/adminModule/email/email.vue'),
            meta: { rolereq: 'admin' }
        },

        {
            name: 'Single Mail',
            path: '/single-mail/:id',
            component: () => import('@/views/adminModule/email/email-tempalte.vue'),
            meta: { rolereq: null }
        },
        {
            name: 'Single cart',
            path: '/single-cart/',
            component: () => import('@/views/customer/vendor/cart-ddta.vue'),
            meta: { rolereq: null }
        },
        {
            name: 'Admin Inbox Mail',
            path: '/inbox-emails',
            component: () => import('@/views/adminModule/email/admin-inbox-mail.vue'),
            meta: { rolereq: null }
        },

        {
            name: 'Reported Packages',
            path: '/admin-pack-reports',
            component: () => import('@/views/adminModule/pack-report/adm-reports.vue'),
            meta: { rolereq: 'admin' }
        },
        // {
        //     name: 'Report Single',
        //     path: '/report-single/:id',
        //     component: () => import('@/views/adminModule/pack-report/report-single.vue'),
        //     // meta: { rolereq: null }
        //     // '/cpackage_pub/:id',
        // },
        {
            name: 'Report Single',
            path: '/report-single/:id',
            component: () => import('@/views/adminModule/pack-report/report-single.vue'),
            meta: { rolereq: 'admin' }
            // meta: { rolereq: null }
            // '/cpackage_pub/:id',
        },

        {
            name: 'Faq Content',
            path: '/faq_content',
            component: () => import('@/views/adminModule/website-data/website-faq.vue')
        },
    ]
};

export default MainRoutes;
