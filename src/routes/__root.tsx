import { Outlet, createRootRoute } from '@tanstack/react-router'
import { CartProvider } from '../context/CartContext'
import { CartSidebar } from '../components/CartSidebar'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() { 
  return (
    <CartProvider>
      <Outlet />
      <CartSidebar />
    </CartProvider>
  ) 
}
