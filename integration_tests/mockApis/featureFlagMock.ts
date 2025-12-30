type FeatureFlagMock = Record<string, boolean>

export default function mockFeatureFlags(flags: FeatureFlagMock) {
  cy.intercept('GET', '/api/features-enabled', {
    statusCode: 200,
    body: {
      features: flags,
    },
  }).as('getFeatureFlags')
}
