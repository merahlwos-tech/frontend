// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Contextes (dossier "context" sans s)
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'

// Layout (dossier "Components" majuscule)
import Navbar from './Components/ui/Navbar'
import Footer from './Components/ui/Footer'
import PrivateRoute from './Components/ui/PrivateRoute'
import AdminLayout from './Components/admin/AdminLayout'

// Pages publiques (dossier "pages" minuscule)
import HomePage from './pages/public/HomePage'
import ProductsPage from './pages/public/ProductsPage'
import ProductDetailPage from './pages/public/ProductDetailPage'
import CartPage from './pages/public/CartPage'
import ConfirmationPage from './pages/public/ConfirmationPage'

// Pages admin
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'

function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1A1A1A',
                color: '#F5F5F5',
                border: '1px solid #3A3A3A',
                borderRadius: 0,
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#10B981', secondary: '#1A1A1A' },
                style: { background: '#1A1A1A', borderLeft: '3px solid #10B981' },
              },
              error: {
                iconTheme: { primary: '#E8001D', secondary: '#1A1A1A' },
                style: { background: '#1A1A1A', borderLeft: '3px solid #E8001D' },
              },
            }}
          />

          <Routes>
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/products" element={<PublicLayout><ProductsPage /></PublicLayout>} />
            <Route path="/products/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
            <Route path="/cart" element={<PublicLayout><CartPage /></PublicLayout>} />
            <Route path="/confirmation" element={<PublicLayout><ConfirmationPage /></PublicLayout>} />

            <Route path="/admin/login" element={<AdminLoginPage />} />

            <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App