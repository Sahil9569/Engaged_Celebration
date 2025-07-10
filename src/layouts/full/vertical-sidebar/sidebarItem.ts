import {
    ChartInfographicIcon,
    SignatureIcon,
    WalletIcon,
    DashboardIcon,
    QuoteIcon,
    PackageIcon,
    StarIcon,
    CircleOffIcon,
    BoxMultipleIcon,
    AppsIcon,
    FileTextIcon,
    FileDotsIcon,
    FilesIcon,
    EditIcon,
    BorderAllIcon,
    BorderHorizontalIcon,
    BorderInnerIcon,
    BorderTopIcon,
    BorderVerticalIcon,
    BoxIcon,
    AlertCircleIcon,
    LoginIcon,
    UserPlusIcon,
    RotateIcon,
    CurrencyDollarIcon,
    ChartLineIcon,
    ChartAreaIcon,
    ChartDotsIcon,
    ChartArcsIcon,
    ChartCandleIcon,
    ChartDonut3Icon,
    ChartRadarIcon,
    ShoppingCartIcon,
    ApertureIcon,
    LayoutIcon,
    HelpIcon,
    UserCircleIcon,
    BoxAlignBottomIcon,
    BoxAlignLeftIcon,
    SettingsIcon,
    ZoomCodeIcon,
    AwardIcon,
    MoodSmileIcon,
    Message2Icon,
    HeartHandshakeIcon,
    PointIcon,
    AppWindowIcon,
    MailIcon,
    BasketIcon,
    CalendarIcon,
    BorderStyle2Icon,
    CalendarPlusIcon,
    CalendarOffIcon,
    TemplateIcon,
    BusinessplanIcon,
} from 'vue-tabler-icons';


export interface menu {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    chip?: string;
    chipBgColor?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: menu[];
    disabled?: boolean;
    type?: string;
    subCaption?: string;
    vtype?: string;
    count?: any;
}



import axios from '@/stores/axios';
async function getcounts() {
    try {
        const response = await axios.post(`/home/getsidebarcounts`);
        return (response.data.data) ? response.data.data : {}
    } catch (error) { console.error('Error while fetching sidebar counts_______', error); return {} }
}

const data = await getcounts()


const sidebarItem: menu[] = [
    {
        title: 'Dashboard',
        icon: DashboardIcon,
        chipColor: 'surface',
        chipBgColor: 'secondary',
        to: '/customer-dashboard',
    },
    {
        title: 'Packages',
        icon: UserCircleIcon,
        chipColor: 'surface',
        chipBgColor: 'secondary',
        to: '/vendor-category',
        count: data?.cat,
    },
    {
        title: 'Contracts',
        icon: SignatureIcon,
        chipColor: 'surface',
        chipBgColor: 'secondary',
        to: '/contracts',
        count: data?.cnt,
    },
    {
        title: 'Bookings',
        icon: CalendarIcon,
        chipColor: 'surface',
        chipBgColor: 'secondary',
        to: '/all-bookings',
        count: data?.obk,
    },
    {
        title: 'Transactions',
        icon: WalletIcon,
        chipColor: 'surface',
        chipBgColor: 'secondary',
        to: '/transactions',
        count: data?.trx,
    },
    {
        title: 'Review/Rating',
        icon: QuoteIcon,
        chipColor: 'surface',
        chipBgColor: 'secondary',
        to: '/reviews',
        count: data?.rvw,
    },
    {
        title: 'Chats',
        icon: Message2Icon,
        chipColor: 'surface',
        chipBgColor: 'secondary',
        to: '/cchats',
        count: data?.cht,
    },
   
    {
        title: 'Email Inbox',
        icon: DashboardIcon,
        chipColor: 'surface',
        chipBgColor: 'secondary',
        to: '/customer-emails',
    },

    // {
    //     title: 'Modern',
    //     icon: ApertureIcon,
    //     chip: 'New',
    //     chipColor: 'surface',
    //     chipBgColor: 'secondary',
    //     to: '/dashboards/modern'
    // },
    // {
    //     title: 'eCommerce',
    //     icon: ShoppingCartIcon,
    //     to: '/dashboards/ecommerce'
    // },
    // { header: 'Apps' },
    // {
    //     title: 'Contact',
    //     icon: BoxIcon,
    //     to: '/apps/contacts',
    //     chip: '2',
    //     chipColor: 'surface',
    //     chipBgColor: 'secondary'
    // },
];

const sidebarItemVendor: menu[] = [
    {
        title: 'Dashboard',
        icon: DashboardIcon,
        to: '/vendor-dashboard',
        vtype: 'any'
    },
    {
        title: 'My Packages',
        icon: PackageIcon,
        to: '/packages',
        count: data?.pck,
        vtype: 'open'
    },
    {
        title: 'Packages',
        icon: PackageIcon,
        to: '/packages',
        count: data?.pck,
        vtype: 'both'
    },
    // {
    //     title: 'Onboarding',
    //     icon: HeartHandshakeIcon,
    //     to: '/onboard',
    //     count:11,
    //     vtype: 'any'
    // },
    {
        title: 'Bookings',
        icon: CalendarIcon,
        to: '/vendor-bookings',
        count: data?.obk,
        vtype: 'open'
    },
    {
        title: 'Bookings',
        icon: CalendarOffIcon,
        to: '/close-bookings',
        count: data?.cbk,
        vtype: 'close'
    },
    {
        title: 'Open Bookings',
        icon: CalendarIcon,
        to: '/vendor-bookings',
        count: data?.obk,
        vtype: 'both'
    },
    {
        title: 'Close Bookings',
        icon: CalendarOffIcon,
        to: '/close-bookings',
        count: data?.cbk,
        vtype: 'both'
    },
    {
        title: 'Manage Contracts',
        icon: SignatureIcon,
        to: '/vendor-contract-listing',
        count: data?.cnt,
        vtype: 'any'
    },
    {
        title: 'Contract Templates',
        icon: TemplateIcon,
        to: '/vendor-contract-templates',
        count: data?.ctp,
        vtype: 'any'
    },
    {
        title: 'Transactions',
        icon: WalletIcon,
        to: '/manage-transaction',
        count: data?.trx,
        vtype: 'any'
    },
    {
        title: 'Manage Payments',
        icon: BusinessplanIcon,
        to: '/manage-payments',
        count: data?.pmt,
        vtype: 'any'
    },
    {
        title: 'Reports',
        icon: ChartInfographicIcon,
        to: '/reporting',
        vtype: 'any'
    },
    {
        title: 'Calendar',
        icon: CalendarPlusIcon,
        to: '/calender',
        vtype: 'any'
    },
    {
        title: 'Review/Rating',
        icon: StarIcon,
        to: '/ratings-listing',
        count: data?.rvw,
        vtype: 'any'
    },
    {
        title: 'Chats',
        icon: Message2Icon,
        to: '/vchats',
        count: data?.cht,
        vtype: 'any'
    },
    {
        title: 'Vendor Email Inbox',
        icon: Message2Icon,
        to: '/vendor-email',
        count: data?.cht,
        vtype: 'any'
    },
    
];

const sidebarItemAdmin: menu[] = [
    {
        title: 'Admin Dashboard',
        icon: DashboardIcon,
        to: '/admin-dashboard',
    },
    {
        title: 'Chats',
        icon: Message2Icon,
        to: '/achats',
        count: data?.cht,
        // children: [
        //     {
        //         title: 'Chat with Vendors',
        //         icon: Message2Icon,
        //         to: '/chats',
        //         count:33,
        //     },
        //     {
        //         title: 'Chat with Customers',
        //         icon: Message2Icon,
        //         to: '/chats',
        //         count:33,
        //     }
        // ]
    },
    {
        title: 'Internal Bookings',
        icon: CalendarIcon,
        to: '/internal-booking',
        count: data?.ibk,
    },
    {
        title: 'Open Bookings',
        icon: CalendarIcon,
        to: '/open-platform-booking',
        count: data?.obk,
    },
    {
        title: 'Manage Payments',
        icon: WalletIcon,
        to: '/manage-payments',
        count: data?.pmt,

    },
    {
        title: 'Wallet Payments',
        icon: WalletIcon,
        to: '/wallet-payment',
        count: data?.pmt,

    },
    {
        title: 'Subscriptions',
        icon: PackageIcon,
        to: '/subscription',
    },
    {
        title: 'My Packages',
        icon: PackageIcon,
        to: '/admin-package-listing',
        count: data?.pck,
    },
    {
        title: 'Calender',
        icon: CalendarIcon,
        to: '/admin-calender',
    },
    {
        title: 'Vendors',
        icon: UserCircleIcon,
        to: '/admin-vendors',
        count: data?.ven,
    },
    {
        title: 'Couples',
        icon: HeartHandshakeIcon,
        to: '/admin-couples',
        count: data?.cup,
    },
    {
        title: 'Reports',
        icon: ChartInfographicIcon,
        to: '/admin-reports',
    },
    {
        title: 'Review/Rating',
        icon: StarIcon,
        to: '/ratings-listing',
        count: data?.rvw,
    },
    {
        title: 'Website Data',
        icon: AwardIcon,
        to: '/website-data',
    },
    {
        title: 'All Mails',
        icon: Message2Icon,
        chipColor: 'surface',
        chipBgColor: 'secondary',
        to: '/admin-emails',
        // count: data?.cht,
    },
    {
        title: 'Reported Packages',
        icon: ChartInfographicIcon,
        chipColor: 'surface',
        chipBgColor: 'secondary',
        to: '/admin-pack-reports',
    },
    
];
export { sidebarItem, sidebarItemVendor, sidebarItemAdmin };
