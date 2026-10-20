import { createFileRoute } from '@tanstack/react-router'
import { TrackOrderPage } from '../pages/TrackOrderPage'

export const Route = createFileRoute('/track/$trackingCode')({
  component: TrackOrderPage,
})
