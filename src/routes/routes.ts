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
import Dashboard from '../Pages/Dashboard/DashboardPage'
import Settings from '../Pages/Dashboard/Settings'
import Users from '../Pages/Dashboard/Users'
import EditChildPage from '../Pages/EditChild/EditChildPage'
import ManageUserProfile from '../Pages/ManageUserProfile/ManageUserProfilePage'

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
        role: ['User', 'Doctor', 'Staff', 'Admin'],
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
        role: ['User', 'Doctor', 'Admin'],
      },
      {
        path: '/doctor/:id',
        component: DoctorProfilePage,
        role: ['User', 'Doctor', 'Admin'],
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
        role: ['User', 'Doctor', 'Staff', 'Admin'],
      },
    ],
  },
  {
    layout: DefaultLayout,
    data: [
      {
        path: '/dashboards',
        component: Dashboard,
        role: ['Admin'],
      },
      {
        path: '/users',
        component: Users,
        role: ['Admin', 'Staff'],
      },
      {
        path: '/settings',
        component: Settings,
        role: ['Admin'],
      },
    ],
  },
]

export default routes
