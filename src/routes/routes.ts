import MainLayout from '../components/layout/MainLayout'
import { LoginPage } from '../Pages/Login&Register/Login&RegisterPage' //không vấn đề gì cả
import { RegisterPage } from '../Pages/Login&Register/Login&RegisterPage'
import Homepage from '../Pages/Home/HomePage'
import GuestHomePage from '../Pages/Home/GuestHomePage'
import { LayoutRoute } from '../types/routes'
import { AboutPage } from '../Pages/About&Contact/About&ContactPage'
import { ContactPage } from '../Pages/About&Contact/About&ContactPage'
import PackagePage from '../Pages/PremiumSubscription/PremiumSubscriptionPage'

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
        path: '/login',
        component: LoginPage,
      },
      {
        path: '/register',
        component: RegisterPage,
      },
      {
        path: '/about',
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
    ],
  },
]

export default routes
