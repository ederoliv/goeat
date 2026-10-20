import { createFileRoute } from '@tanstack/react-router'
import { AuthPage } from '../pages/AuthPage'

export const Route = createFileRoute('/restaurant/login')({
  component: () => <AuthPage mode="login" account="restaurant" />,
})
