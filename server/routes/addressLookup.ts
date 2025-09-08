export default {
  employers: {
    employerList: () => '/',
    employerReview: (id: string) => `/employers/employer/${id}`,
    employerUpdate: (id: string, mode = 'add') => `/employers/employer/${id}/form/${mode}`,
  },
  jobs: {
    jobList: () => '/jobs',
    jobReview: (id: string) => `/jobs/job/${id}`,
    jobRoleUpdate: (id: string, mode = 'add') => `/jobs/job/${id}/role/${mode}`,
    jobContractUpdate: (id: string, mode = 'add') => `/jobs/job/${id}/contract/${mode}`,
    jobRequirementsUpdate: (id: string, mode = 'add') => `/jobs/job/${id}/requirements/${mode}`,
    jobHowToApplysUpdate: (id: string, mode = 'add') => `/jobs/job/${id}/how-to-apply/${mode}`,
  },
  jobsv2: {
    jobReview: (id: string) => `/jobs/job/${id}`,
    jobAddEmployer: (id: string, mode = 'add') => `/jobs/job/${id}/add-employer/${mode}`,
    jobIsThisNational: (id: string, mode = 'add') => `/jobs/job/${id}/is-this-national-job/${mode}`,
  },
}
