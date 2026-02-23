import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { WishlistProvider } from './context/WishlistContext'
import Navbar from './Components/ui/Navbar'
import Footer from './Components/ui/Footer'
import PrivateRoute from './Components/ui/PrivateRoute'
import AdminLayout from './Components/admin/AdminLayout'
import HomePage from './pages/public/HomePage'
import ProductsPage from './pages/public/ProductsPage'
import ProductDetailPage from './pages/public/ProductDetailPage'
import CartPage from './pages/public/CartPage'
import ConfirmationPage from './pages/public/ConfirmationPage'
import AboutPage from './pages/public/AboutPage'
import TagProductsPage from './pages/public/TagProductsPage'
import WishlistPage from './pages/public/WishlistPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage'

function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-32">{children}</main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#FFFFFF',
                  color: '#1A1A2E',
                  border: '1px solid #F0EDF5',
                  borderRadius: '12px',
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: '14px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                },
                success: { iconTheme: { primary: '#4A8C6A', secondary: '#fff' } },
                error: { iconTheme: { primary: '#CC5555', secondary: '#fff' } },
              }}
            />
            <Routes>
              <Route path="/"             element={<PublicLayout><HomePage /></PublicLayout>} />
              <Route path="/products"     element={<PublicLayout><ProductsPage /></PublicLayout>} />
              <Route path="/products/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
              <Route path="/tag/:tag"     element={<PublicLayout><TagProductsPage /></PublicLayout>} />
              <Route path="/cart"         element={<PublicLayout><CartPage /></PublicLayout>} />
              <Route path="/confirmation" element={<PublicLayout><ConfirmationPage /></PublicLayout>} />
              <Route path="/about"        element={<PublicLayout><AboutPage /></PublicLayout>} />
              <Route path="/wishlist"     element={<PublicLayout><WishlistPage /></PublicLayout>} />
              <Route path="/admin/login"  element={<AdminLoginPage />} />
              <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
                <Route index             element={<AdminDashboardPage />} />
                <Route path="products"   element={<AdminProductsPage />} />
                <Route path="orders"     element={<AdminOrdersPage />} />
                <Route path="orders/:id" element={<AdminOrderDetailPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

//export default App