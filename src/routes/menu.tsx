import { createFileRoute } from '@tanstack/react-router'
import { MenuPage } from '../pages/MenuPage'

export const Route = createFileRoute('/menu')({
  component: MenuPage
})