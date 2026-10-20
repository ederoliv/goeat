import { createFileRoute } from '@tanstack/react-router'
import { AuthPage } from '../pages/AuthPage'

export const Route = createFileRoute('/restaurant/register')({
  component: () => <AuthPage mode="register" account="restaurant" />,
})
