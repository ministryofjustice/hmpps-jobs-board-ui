export default {
  homePage: () => '/',
  employers: {
    employerReview: (id: string) => `/employers/employer/${id}`,
    employerUpdate: (id = 'new') => `/employers/employer/${id}/update`,
  },
}
