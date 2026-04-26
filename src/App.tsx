import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
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

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0c0f0f] text-[#f9f9f9] font-sans">
        <div className="max-w-[450px] mx-auto min-h-screen relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/dish/:id" element={<DishPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/order/:id" element={<OrderDetailPage />} />
            <Route path="/wellness" element={<WellnessPage />} />
            <Route path="/trust" element={<TrustPage />} />
            <Route path="/track" element={<TrackPage />} />
            <Route path="/family" element={<FamilyPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
