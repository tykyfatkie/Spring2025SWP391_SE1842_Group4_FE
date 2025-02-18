import MainLayout from '../components/layout/MainLayout'
import { LoginPage } from '../Pages/Login/LoginPage'
import { RegisterPage } from '../Pages/Login/LoginPage'
import Homepage from '../Pages/Home/HomePage'
import GuestHomePage from '../Pages/Home/GuestHomePage'
import { LayoutRoute } from '../types/routes'
import { AboutPage } from '../Pages/About&Contact/About&ContactPage'
import { ContactPage } from '../Pages/About&Contact/About&ContactPage'

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
    ],
  },
  // {
  //   layout: SimpleLayout,
  //   data: [
  //     {
  //       path: '/login',
  //       component: LoginPage,
  //     },
  //     {
  //       path: '/register',
  //       component: RegisterPage,
  //     },
  //   ],
  // },
  // {
  //   layout: AdminLayout,
  //   data: [
  //     {
  //       path: '/admin',
  //       component: Admin,
  //       role: ['admin'],
  //     },

  //   ],
  // },
]

export default routes
