export default {
  employers: {
    employerList: () => '/',
    employerReview: (id: string) => `/employers/employer/${id}`,
    employerUpdate: (id = 'new') => `/employers/employer/${id}/update`,
  },
  jobs: {
    jobList: () => '/jobs',
    jobReview: (id: string) => `/jobs/job/${id}`,
    jobRoleUpdate: (id = 'new') => `/jobs/job/${id}/role`,
  },
}
