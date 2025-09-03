import { defineConfig } from 'cypress'
import { resetStubs } from './integration_tests/mockApis/wiremock'
import auth from './integration_tests/mockApis/auth'
import manageUsersApi from './integration_tests/mockApis/manageUsersApi'
import employerApi from './integration_tests/mockApis/employerApi'
import jobApi from './integration_tests/mockApis/jobApi'
import nomisUserRolesApi from './integration_tests/mockApis/nomisUserRolesApi'
import tokenVerification from './integration_tests/mockApis/tokenVerification'

export default defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: 'integration_tests/fixtures',
  screenshotsFolder: 'integration_tests/screenshots',
  videosFolder: 'integration_tests/videos',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  taskTimeout: 60000,
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        reset: resetStubs,
        ...auth,
        ...manageUsersApi,
        ...employerApi,
        ...jobApi,
        ...nomisUserRolesApi,
        ...tokenVerification,
      })

      // Return a new config object instead of mutating
      return {
        ...config,
        env: {
          ...config.env,
          filterJobsCreatedByMeEnabled: process.env.FILTER_JOBS_CREATED_BY_ME_ENABLED === 'true',
        },
      }
    },
    baseUrl: 'http://localhost:3007',
    excludeSpecPattern: '**/!(*.cy).ts',
    specPattern: 'integration_tests/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'integration_tests/support/index.ts',
    redirectionLimit: 100,
  },
})
