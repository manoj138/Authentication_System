import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Dashboard from '../pages/backend/Dashboard'
import DefaultLayout from '../layout/DefaultLayout'
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