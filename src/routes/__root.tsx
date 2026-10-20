import { Outlet, createRootRoute } from '@tanstack/react-router'
import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'
import { CartSidebar } from '../components/CartSidebar'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <AuthProvider>
      <CartProvider>
        <Outlet />
        <CartSidebar />
      </CartProvider>
    </AuthProvider>
  )
}
