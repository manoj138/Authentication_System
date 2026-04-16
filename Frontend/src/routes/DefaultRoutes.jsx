import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Dashboard from '../pages/backend/Dashboard'
import DefaultLayout from '../layout/DefaultLayout'
import ProductIndex from '../pages/backend/Product/ProductIndex'
import ProductCreate from '../pages/backend/Product/ProductCreate'
import ProductEdit from '../pages/backend/Product/ProductEdit'
import ProductShow from '../pages/backend/Product/ProductShow'
import UserIndex from '../pages/backend/user/UserIndex'

// Auth Pages
import Login from '../pages/frontend/auth/Login'
import Register from '../pages/frontend/auth/Register'

// Route Wrappers
import ProtectedRoute from '../layout/ProtectedRoute'
import PublicRoute from '../layout/PublicRoute'

const DefaultRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Backend Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<DefaultLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Admin and User Routes */}
          <Route path="products" element={<ProductIndex />} />
          <Route path="products/create" element={<ProductCreate />} />
          <Route path="products/edit/:id" element={<ProductEdit />} />
          <Route path="products/show/:id" element={<ProductShow />} />
          
          {/* Admin-only Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="users" element={<UserIndex />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default DefaultRoutes