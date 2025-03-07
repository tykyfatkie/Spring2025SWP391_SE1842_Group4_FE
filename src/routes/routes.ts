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
import CreateChild from '../Pages/CreateChild/CreateChild'
import AnalyticsPage from '../Pages/Analytics/AnalyticsPage'
import DoctorPage from '../Pages/Doctor/DoctorPage'
import DoctorProfilePage from '../Pages/Doctor/DoctorProfilePage'
import ParentProfilePage from '../Pages/Parent/ParentProfilePage'
import DefaultLayout from '../layouts/DefaultLayout'
import AdminPage from '../Pages/Dashboard/AdminPage'
import Settings from '../Pages/Dashboard/Settings'
import Users from '../Pages/Dashboard/Users'
import EditChildPage from '../Pages/EditChild/EditChildPage'
import ManageUserProfile from '../Pages/ManageUserProfile/ManageUserProfilePage'
import DoctorPage from '../Pages/Doctor/DoctorPage'

const routes: LayoutRoute[] = [
  {
    layout: MainLayout,
    data: [
      {
        path: '/',
        component: GuestHomePage,
        exact: true,
        role: ['Guest'],
      },
      {
        path: '/home',
        component: Homepage,
        exact: true,
        role: ['User'],
      },
      {
        path: '/login',
        component: LoginPage,
        role: ['Guest'],
      },
      {
        path: '/register',
        component: RegisterPage,
        role: ['Guest'],
      },
      {
        path: '/forgot-password',
        component: ForgotPasswordPage,
        role: ['Guest'],
      },
      {
        path: '/about-us',
        component: AboutPage,
        role: ['User', 'Guest'],
      },
      {
        path: '/contact-us',
        component: ContactPage,
        role: ['Guest', 'User'],
      },
      {
        path: '/package',
        component: PackagePage,
        role: ['Guest', 'User'],
      },
      {
        path: '/guestbmi',
        component: GuestBMICalculator,
        role: ['Guest', 'User'],
      },
      {
        path: '/dashboard',
        component: UpdateChildPage,
        role: ['Admin', 'Staff'],
      },
      {
        path: '/child-create',
        component: CreateChild,
        role: ['User'],
      },
      {
        path: '/child-analytics',
        component: AnalyticsPage,
        role: ['User', 'Doctor'],
      },
      {
        path: '/doctor',
        component: DoctorPage,
        role: ['User', 'Doctor'],
      },
      {
        path: '/doctor/:id',
        component: DoctorProfilePage,
        role: ['User', 'Doctor'],
      },
      {
        path: '/profile',
        component: ParentProfilePage,
        role: ['User'],
      },
      {
        path: '/child-edit',
        component: EditChildPage,
        role: ['User'],
      },
      {
        path: '/manage-profile',
        component: ManageUserProfile,
        role: ['User'],
      },    
    ],
  },
  {
    layout: DefaultLayout,
    data: [
      {
        path: '/my-admin',
        component: AdminPage,
        role: ['Admin'],
      },
      {
        path: '/my-admin/users',
        component: Users,
        role: ['Admin'],
      },
      {
        path: '/my-admin/doctors',
        component: DoctorPage,
        role: ['Admin'],
      },
      {
        path: '/my-admin/settings',
        component: Settings,
        role: ['Admin'],
      },
    ],
  },
]

export default routes
