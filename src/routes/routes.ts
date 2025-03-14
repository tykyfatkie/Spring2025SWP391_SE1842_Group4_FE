import MainLayout from "../components/layout/MainLayout";
import LoginPage from "../Pages/Login/LoginPage";
import RegisterPage from "../Pages/Register/RegisterPage";
import Homepage from "../Pages/Home/HomePage";
import { LayoutRoute } from "../types/routes";
import AboutPage from "../Pages/About/AboutPage";
import ContactPage from "../Pages/Contact/ContactPage";
import PackagePage from "../Pages/PremiumSubscription/PremiumSubscriptionPage";
import GuestBMICalculator from "../Pages/BMI cal/GuestBMICalculator";
import ForgotPasswordPage from "../Pages/ForgotPassword/ForgotPasswordPage";
import UpdateChildPage from "../Pages/UpdateChild/UpdateChildPage";
import CreateChild from "../Pages/CreateChild/CreateChild";
import AnalyticsPage from "../Pages/Analytics/AnalyticsPage";
import DoctorPage from "../Pages/Doctor/DoctorPage";
import DoctorProfilePage from "../Pages/Doctor/DoctorProfilePage";
import ParentProfilePage from "../Pages/Parent/ParentProfilePage";
import DefaultLayout from "../layouts/DefaultLayout";
import AdminPage from "../Pages/Dashboard/AdminPage";
import Settings from "../Pages/Dashboard/Settings";
import Users from "../Pages/Dashboard/Users";
import ManageUserProfile from "../Pages/ManageUserProfile/ManageUserProfilePage";
import ProtectedRoute from "../utils/ProtectedRoute"; 
import DoctorsPage from "../Pages/Dashboard/Doctors"; 
import React from "react";
import ChildManage from "../Pages/ChildManage/ChildManage";
import MyDoctorProfilePage from "../Pages/MyDoctor/MyDoctor";
import UpdateDoctorProfile from "../Pages/MyDoctor/UpdateDoctorProfile";
import PackagesPage from "../Pages/Dashboard/PackagePage";
import PaymentSuccessPage from "../Pages/PaymentSuccess/PaymentSuccessPage";
import BMITrackingPage from "../Pages/Analytics/AnalyticsPage";
import BMIPage from "../Pages/BMI cal/BMIPage";
import UserConsultationRequests from "../Pages/UserConsultationRequests/UserConsultationRequestsPage";
import DoctorConsultationResponse from "../Pages/DoctorConsultationResponse/DoctorConsultationResponse";

const ProtectedComponent = (Component: React.ComponentType<any>, allowedRoles: string[]) => {
  return (props: any) => 
      React.createElement(ProtectedRoute, { Component, role: allowedRoles, ...props });
};

const routes: LayoutRoute[] = [
  {
    layout: MainLayout,
    data: [
      { path: "/", component: Homepage, exact: true, role: ["Guest"] },
      { path: "/home", component: ProtectedComponent(Homepage, ["User"]) },
      { path: "/login", component: LoginPage, role: ["Guest"] },
      { path: "/register", component: RegisterPage, role: ["Guest"] },
      { path: "/forgot-password", component: ForgotPasswordPage, role: ["Guest"] },
      { path: "/about-us", component: AboutPage, role: ["User", "Guest"] },
      { path: "/contact-us", component: ContactPage, role: ["Guest", "User"] },
      { path: "/package", component: PackagePage, role: ["User"] },
      { path: "/bmi", component: BMIPage, role: ["User"] },
      { path: "/guestbmi", component: GuestBMICalculator, role: ["Guest", "User"] },
      { path: "/dashboard", component: ProtectedComponent(UpdateChildPage, ["Admin"]) },
      { path: "/child-create", component: ProtectedComponent(CreateChild, ["User"]) },
      { path: "/child-analytics", component: ProtectedComponent(BMITrackingPage, ["User"]) },
      { path: "/doctor", component: ProtectedComponent(DoctorPage, ["User", "Doctor"]) },
      { path: "/doctor/:id", component: ProtectedComponent(DoctorProfilePage, ["User"]) },
      { path: "/my-doctor", component: ProtectedComponent(MyDoctorProfilePage, [ "Doctor"]) },
      { path: "/update-doctor-profile", component: ProtectedComponent(UpdateDoctorProfile, [ "Doctor"]) },
      { path: "/profile", component: ProtectedComponent(ParentProfilePage, ["User", "Doctor"]) },
      { path: "/child-manage", component: ProtectedComponent(ChildManage, ["User"]) },
      { path: "/manage-profile", component: ProtectedComponent(ManageUserProfile, ["User", "Doctor"]) },
      { path: "/payment-success", component: PaymentSuccessPage, exact: true, role: ["User"] },
      { path: "/consultation-requests", component: UserConsultationRequests, exact: true, role: ["User"] },
      { path: "/my-doctor/consultation-response", component: DoctorConsultationResponse, exact: true, role: ["Doctor"] },

    ],
  },
  {
    layout: DefaultLayout,
    data: [
      { path: "/my-admin", component: ProtectedComponent(AdminPage, ["Admin"]) },
      { path: "/my-admin/users", component: ProtectedComponent(Users, ["Admin"]) },
      { path: "/my-admin/doctors", component: ProtectedComponent(DoctorsPage, ["Admin"]) },
      { path: "/my-admin/settings", component: ProtectedComponent(Settings, ["Admin"]) },
      { path: "/my-admin/packages", component: ProtectedComponent(PackagesPage, ["Admin"]) },
    ],
  },
];

export default routes;