import MainLayout from '../components/layout/MainLayout'
import LoginPage from '../Pages/Login/LoginPage'
import RegisterPage from '../Pages/Register/RegisterPage'
import Homepage from '../Pages/Home/HomePage'
import GuestHomePage from '../Pages/Home/GuestHomePage'
import { LayoutRoute } from '../types/routes'
import AboutPage from '../Pages/About/AboutPage'
import ContactPage from '../Pages/Contact/ContactPage'
import PackagePage from '../Pages/PremiumSubscription/PremiumSubscriptionPage'
import GuestBMICalculator from '../Pages/BMI cal/GuestBMICalculator'
import ForgotPasswordPage from '../Pages/ForgotPassword/ForgotPasswordPage'
import UpdateChildPage from '../Pages/UpdateChild/UpdateChildPage'
import ChildProfilePage from '../Pages/ChildProfile/ChildProfilePage'
import AnalyticsPage from '../Pages/Analytics/AnalyticsPage'
import DoctorPage from '../Pages/Doctor/DoctorPage'
import DoctorProfilePage from '../Pages/Doctor/DoctorProfilePage'


// const token = localStorage.getItem('childgrowthtrackingsystem');
// const { account } = useAppSelector((state) => state.auth);
// const isAdmin = account && account.user && account.user.role.includes('Admin');
// const isStoreOwner = account && account.user && account.user.role.includes('User');
// const isCustomer = account && account.user && account.user.role.includes('Guest');
const routes: LayoutRoute[] = [
  {
    layout: MainLayout,
    data: [
      {
        path: '/',
        component: GuestHomePage,
        exact: true,
      },
      {
        path: '/home',
        component: Homepage,
        exact: true,
      },
      {
        path: '/login',
        component: LoginPage,
      },
      {
        path: '/register',
        component: RegisterPage,
      },
      {
        path: '/forgot-password',
        component: ForgotPasswordPage,
      },
      {
        path: '/about-us',
        component: AboutPage,
      },
      {
        path: '/contact-us',
        component: ContactPage,
      },
      {
        path: '/package',
        component: PackagePage,
      },
      {
        path: '/guestbmi',
        component: GuestBMICalculator,
      },
      {
        path: '/dashboard',
        component: UpdateChildPage,
      },
      {
        path: '/child-create',
        component: ChildProfilePage,
      },
      {
        path: '/child-analytics',
        component: AnalyticsPage,
      },
      {
        path: '/doctor',
        component: DoctorPage,
      },
      {
        path: '/doctor/:id',
        component: DoctorProfilePage,
      },
    ],
    
  },
]

export default routes
function useAppSelector(arg0: (state: any) => any): { account: any } {
  throw new Error('Function not implemented.')
}

