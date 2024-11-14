import promClient from 'prom-client'
import { createMetricsApp } from './monitoring/metricsApp'
import createApp from './app'
import { services } from './services'
import applicationInfo from './applicationInfo'

promClient.collectDefaultMetrics()

const app = createApp(services(), applicationInfo())
const metricsApp = createMetricsApp()

export { app, metricsApp }
