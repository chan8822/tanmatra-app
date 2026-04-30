import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";

// Customer pages (eager)
import HomePage from "@/pages/Home";
import MenuPage from "@/pages/Menu";
import CartPage from "@/pages/Cart";
import CheckoutPage from "@/pages/Checkout";
import OrdersPage from "@/pages/Orders";
import TrackPage from "@/pages/Track";
import ProfilePage from "@/pages/Profile";

// Lazy loaded pages
const DishPage = lazy(() => import("@/pages/Dish"));
const WellnessPage = lazy(() => import("@/pages/Wellness"));
const ConsultRDPage = lazy(() => import("@/pages/ConsultRD"));
const HealthQuizPage = lazy(() => import("@/pages/HealthQuiz"));
const GoldPage = lazy(() => import("@/pages/Gold"));
const SubscriptionsPage = lazy(() => import("@/pages/Subscriptions"));
const NotificationsPage = lazy(() => import("@/pages/Notifications"));
const SupportPage = lazy(() => import("@/pages/Support"));
const SettingsPage = lazy(() => import("@/pages/Settings"));

// Admin / Ops (lazy)
const AdminPage = lazy(() => import("@/pages/Admin"));
const AllOrdersPage = lazy(() => import("@/pages/AllOrders"));
const KDSPage = lazy(() => import("@/pages/KDS"));
const StaffPage = lazy(() => import("@/pages/Staff"));
const RidersPage = lazy(() => import("@/pages/Riders"));
const AnalyticsPage = lazy(() => import("@/pages/Analytics"));

const withNav = (Page: React.ComponentType) => () => (
  <>
    <Page />
    <BottomNav />
  </>
);

const lazyWrap = (Component: React.ComponentType) => (
  <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white/40 text-sm">Loading...</div>}>
    <Component />
  </Suspense>
);

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white antialiased">
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={withNav(HomePage)()} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/dish/:id" element={lazyWrap(DishPage)} />
        <Route path="/basket" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/track/:id" element={<TrackPage />} />
        <Route path="/profile" element={withNav(ProfilePage)()} />
        <Route path="/wellness" element={lazyWrap(WellnessPage)} />
        <Route path="/consult-rd" element={lazyWrap(ConsultRDPage)} />
        <Route path="/health-quiz" element={lazyWrap(HealthQuizPage)} />
        <Route path="/gold" element={lazyWrap(GoldPage)} />
        <Route path="/subscriptions" element={lazyWrap(SubscriptionsPage)} />
        <Route path="/notifications" element={lazyWrap(NotificationsPage)} />
        <Route path="/support" element={lazyWrap(SupportPage)} />
        <Route path="/settings" element={lazyWrap(SettingsPage)} />

        {/* Admin / Ops Routes */}
        <Route path="/admin" element={lazyWrap(AdminPage)} />
        <Route path="/admin/orders" element={lazyWrap(AllOrdersPage)} />
        <Route path="/admin/kds" element={lazyWrap(KDSPage)} />
        <Route path="/admin/staff" element={lazyWrap(StaffPage)} />
        <Route path="/admin/riders" element={lazyWrap(RidersPage)} />
        <Route path="/admin/analytics" element={lazyWrap(AnalyticsPage)} />
      </Routes>
    </div>
  );
}
