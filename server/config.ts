const production = process.env.NODE_ENV === 'production'

// Add a fallback mechanism in config.ts to detect and handle cases where APPLICATIONINSIGHTS_CONNECTION_STRING is empty
const appInsightsInstrumentationKey = process.env.APPINSIGHTS_INSTRUMENTATIONKEY
const appInsightsConnectionString = appInsightsInstrumentationKey
  ? `InstrumentationKey=${appInsightsInstrumentationKey};IngestionEndpoint=https://northeurope-0.in.applicationinsights.azure.com/;LiveEndpoint=https://northeurope.livediagnostics.monitor.azure.com/`
  : ''

function get<T>(name: string, fallback: T, options = { requireInProduction: false }): T | string {
  if (process.env[name]) {
    return process.env[name]
  }
  if (fallback !== undefined && (!production || !options.requireInProduction)) {
    return fallback
  }
  throw new Error(`Missing env var ${name}`)
}

const requiredInProduction = { requireInProduction: true }
const systemPhase = get('SYSTEM_PHASE', 'DEV').toUpperCase()

export class AgentConfig {
  // Sets the working socket to timeout after timeout milliseconds of inactivity on the working socket.
  timeout: number

  constructor(timeout = 8000) {
    this.timeout = timeout
  }
}

export interface ApiConfig {
  url: string
  timeout: {
    // sets maximum time to wait for the first byte to arrive from the server, but it does not limit how long the
    // entire download can take.
    response: number
    // sets a deadline for the entire request (including all uploads, redirects, server processing time) to complete.
    // If the response isn't fully downloaded within that time, the request will be aborted.
    deadline: number
  }
  agent: AgentConfig
}

export default {
  buildNumber: get('BUILD_NUMBER', '1_0_0', requiredInProduction),
  productId: get('PRODUCT_ID', 'UNASSIGNED', requiredInProduction),
  gitRef: get('GIT_REF', 'xxxxxxxxxxxxxxxxxxx', requiredInProduction),
  branchName: get('GIT_BRANCH', 'xxxxxxxxxxxxxxxxxxx', requiredInProduction),
  production,
  https: production,
  staticResourceCacheDuration: '1h',
  paginationPageSize: 20,
  redis: {
    enabled: get('REDIS_ENABLED', 'false', requiredInProduction) === 'true',
    host: get('REDIS_HOST', 'localhost', requiredInProduction),
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_AUTH_TOKEN,
    tls_enabled: get('REDIS_TLS_ENABLED', 'false'),
  },
  session: {
    secret: get('SESSION_SECRET', 'app-insecure-default-session', requiredInProduction),
    expiryMinutes: Number(get('WEB_SESSION_TIMEOUT_IN_MINUTES', 120)),
  },
  apis: {
    hmppsAuth: {
      url: get('HMPPS_AUTH_URL', 'http://localhost:9090/auth', requiredInProduction),
      externalUrl: get('HMPPS_AUTH_EXTERNAL_URL', get('HMPPS_AUTH_URL', 'http://localhost:9090/auth')),
      timeout: {
        response: Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('HMPPS_AUTH_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000))),
      apiClientId: get('API_CLIENT_ID', 'clientid', requiredInProduction),
      apiClientSecret: get('API_CLIENT_SECRET', 'clientsecret', requiredInProduction),
      systemClientId: get('SYSTEM_CLIENT_ID', 'clientid', requiredInProduction),
      systemClientSecret: get('SYSTEM_CLIENT_SECRET', 'clientsecret', requiredInProduction),
    },
    hmppsAudit: {
      enabled: get('AUDIT_ENABLED', 'false') === 'true',
      auditServiceName: get('AUDIT_SERVICE_NAME', 'hmpps-jobs-board-ui'),
    },
    nomisUserRolesApi: {
      url: get('NOMIS_USER_ROLES_API_URL', 'http://localhost:8082', requiredInProduction),
      timeout: {
        response: Number(get('NOMIS_USER_ROLES_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('NOMIS_USER_ROLES_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(),
    },
    manageUsersApi: {
      url: get('MANAGE_USERS_API_URL', 'http://localhost:9091', requiredInProduction),
      timeout: {
        response: Number(get('MANAGE_USERS_API_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('MANAGE_USERS_API_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('MANAGE_USERS_API_TIMEOUT_RESPONSE', 10000))),
    },
    tokenVerification: {
      url: get('TOKEN_VERIFICATION_API_URL', 'http://localhost:8100', requiredInProduction),
      timeout: {
        response: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000))),
      enabled: get('TOKEN_VERIFICATION_ENABLED', 'false') === 'true',
    },
    frontendComponents: {
      url: get('COMPONENT_API_URL', 'http://localhost:8083', requiredInProduction),
      timeout: {
        response: Number(get('COMPONENT_API_URL', 10000)),
        deadline: Number(get('COMPONENT_API_URL', 10000)),
      },
      agent: new AgentConfig(),
    },
    jobApi: {
      url: get('JOB_API_URL', 'http://localhost:8083', requiredInProduction),
      timeout: {
        response: Number(get('JOB_API_URL', 10000)),
        deadline: Number(get('JOB_API_URL', 10000)),
      },
      agent: new AgentConfig(),
    },
  },
  domain: get('INGRESS_URL', 'http://localhost:3000', requiredInProduction),
  dpsHomeUrl: get('DPS_URL', 'http://localhost:3001/', requiredInProduction),
  workAfterReleaseUrl: get('WORK_AFTER_RELEASE_URL', 'http://localhost:3000/', requiredInProduction),
  phaseName: get('SYSTEM_PHASE', '', requiredInProduction),
  environmentName: get('ENVIRONMENT_NAME', ''),
  urlParameterPassphrase: get('PASSPHRASE', '', requiredInProduction),
  googleAnalytics: {
    containerId: get('GOOGLE_TAG_MANAGER_CONTAINER_ID', ''),
    googleAnalyticsId: get('GOOGLE_ANALYTICS_ID', '', requiredInProduction),
  },
  appInsightsConnectionString,
  featureToggles: {
    filterJobsCreatedByMeEnabled: systemPhase === 'DEV',
    nationalJobs: get('FEATURE_FLAG_NATIONAL_JOBS', 'false'),
  },
}
