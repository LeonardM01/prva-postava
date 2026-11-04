import { createFileRoute } from '@tanstack/react-router'

import { BannerQrPage } from '#/features/banner-qr/banner-qr-page'
import { BANNER_QR_ROUTE_OPTIONS } from '#/features/banner-qr/banner-qr-route-options'

export const Route = createFileRoute('/banner-qr')({
  ...BANNER_QR_ROUTE_OPTIONS,
  component: BannerQrPage,
})
