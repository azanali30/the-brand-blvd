import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Products from "./pages/products/Products";
import AddProduct from "./pages/products/AddProduct";
import EditProduct from "./pages/products/EditProduct";

import Categories from "./pages/categories/Categories";
import AddCategory from "./pages/categories/AddCategory";
import EditCategory from "./pages/categories/EditCategory";

import Orders from "./pages/orders/Orders";
import OrderDetails from "./pages/orders/OrderDetails";
import EditOrder from "./pages/orders/EditOrder";


import Customers from "./pages/customers/Customers";
import CustomerDetails from "./pages/customers/CustomerDetails";

import Settings from "./pages/settings/Settings";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Area */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AdminLayout />}>
            
            {/* Dashboard */}
            <Route index element={<Dashboard />} />

            {/* Products */}
            <Route path="products" element={<Products />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/:id/edit" element={<EditProduct />} />

            {/* Categories */}
            <Route path="categories" element={<Categories />} />
            <Route path="categories/add" element={<AddCategory />} />
            <Route path="/categories/:id/edit" element={<EditCategory />} />
            {/* Orders — ✅ Ab AdminLayout ke ANDAR hain */}
            <Route path="orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/orders/:id/edit" element={<EditOrder />} />

            <Route path="customers" element={<Customers />} />
            <Route path="customers/:id" element={<CustomerDetails />} />

            <Route path="settings" element={<Settings />} />

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;