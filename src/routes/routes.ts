import MainLayout from '../components/layout/MainLayout'
import { LoginPage } from '../Pages/Login&Register/Login&RegisterPage' 
import { RegisterPage } from '../Pages/Login&Register/Login&RegisterPage'
import Homepage from '../Pages/Home/HomePage'
import GuestHomePage from '../Pages/Home/GuestHomePage'
import { LayoutRoute } from '../types/routes'
import { AboutPage } from '../Pages/About&Contact/About&ContactPage'
import { ContactPage } from '../Pages/About&Contact/About&ContactPage'
import PackagePage from '../Pages/PremiumSubscription/PremiumSubscriptionPage'
import GuestBMICalculator from '../Pages/BMI cal/GuestBMICalculator'
import DoctorPage from '../Pages/Doctor/DoctorPage'
import DoctorProfilePage from '../Pages/Doctor/DoctorProfilePage'
import ParentProfilePage from '../Pages/Parent/ParentProfilePage'


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
        path: '/doctor',
        component: DoctorPage,
      },
      {
        path: '/doctor/:id',
        component: DoctorProfilePage,
      },
      {
        path: '/profile',
        component: ParentProfilePage,
      }
    ],
  },
]

export default routes
function useAppSelector(arg0: (state: any) => any): { account: any } {
  throw new Error('Function not implemented.')
}

