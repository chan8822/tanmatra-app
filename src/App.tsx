import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "@/pages/Home";
import MenuPage from "@/pages/Menu";
import DishPage from "@/pages/Dish";
import CartPage from "@/pages/Cart";
import CheckoutPage from "@/pages/Checkout";
import OrdersPage from "@/pages/Orders";
import OrderDetailPage from "@/pages/OrderDetail";
import WellnessPage from "@/pages/Wellness";
import TrustPage from "@/pages/Trust";
import TrackPage from "@/pages/Track";
import FamilyPage from "@/pages/Family";
import AdminPage from "@/pages/Admin";
import AdminStaffPage from "@/pages/AdminStaff";
import AdminRidersPage from "@/pages/AdminRiders";
import AdminAnalyticsPage from "@/pages/AdminAnalytics";
import AdminSettingsPage from "@/pages/AdminSettings";
import SubscriptionsPage from "@/pages/Subscriptions";
import ReferralPage from "@/pages/Referral";
import RiderTrackingPage from "@/pages/RiderTracking";
import RateOrderPage from "@/pages/RateOrder";
import SupportPage from "@/pages/Support";
import NotificationsPage from "@/pages/Notifications";
import AddressSelectorPage from "@/pages/AddressSelector";
import ProfilePage from "@/pages/Profile";
import NotificationPrefsPage from "@/pages/NotificationPrefs";
import AccountSettingsPage from "@/pages/AccountSettings";
import GoldPage from "@/pages/Gold";
import { ToastContainer } from "@/components/Toast";
import ConsultRDPage from "@/pages/ConsultRD";
import HealthQuizPage from "@/pages/HealthQuiz";

export default function App() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/dish/:id" element={<DishPage />} />
        <Route path="/basket" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/order/:orderId" element={<OrderDetailPage />} />
        <Route path="/wellness" element={<WellnessPage />} />
        <Route path="/trust" element={<TrustPage />} />
        <Route path="/track" element={<TrackPage />} />
        <Route path="/family" element={<FamilyPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/staff" element={<AdminStaffPage />} />
        <Route path="/admin/riders" element={<AdminRidersPage />} />
        <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/refer" element={<ReferralPage />} />
        <Route path="/tracking" element={<RiderTrackingPage />} />
        <Route path="/rate" element={<RateOrderPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/address" element={<AddressSelectorPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notification-prefs" element={<NotificationPrefsPage />} />
        <Route path="/settings" element={<AccountSettingsPage />} />
        <Route path="/gold" element={<GoldPage />} />
        <Route path="/consult-rd" element={<ConsultRDPage />} />
        <Route path="/health-quiz" element={<HealthQuizPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}
