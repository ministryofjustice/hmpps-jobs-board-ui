import { stubFor } from './wiremock'

const getUserActiveCaseLoad = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: '/nomisUserRolesApi/me/caseloads',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        activeCaseload: {
          id: 1,
          name: 'Moorland (HMP & YOI)',
        },
      },
    },
  })

const getStaffDetails = (staffId = 485588) =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/nomisUserRolesApi/users/staff/${staffId}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        staffId: 486233,
        firstName: 'testuser',
        lastName: 'User-1',
        status: 'ACTIVE',
        primaryEmail: 'testuser.User-1@justice.gov.uk',
        generalAccount: {
          username: 'TUSER-1_GEN',
          active: true,
          accountType: 'GENERAL',
          activeCaseload: {
            id: 'LEI',
            name: 'Leeds (HMP)',
          },
          caseloads: [
            {
              id: 'LEI',
              name: 'Leeds (HMP)',
            },
            {
              id: 'NWEB',
              name: 'Nomis-web Application',
            },
            {
              id: 'PBI',
              name: 'Peterborough (HMP)',
            },
            {
              id: 'PFI',
              name: 'Peterborough Female HMP',
            },
            {
              id: 'OWI',
              name: 'Oakwood (HMP)',
            },
            {
              id: 'WEI',
              name: 'Wealstun (HMP)',
            },
            {
              id: 'PVI',
              name: 'Pentonville (HMP)',
            },
          ],
        },
      },
    },
  })

const getUserRoles = (userId = 'USER1') =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/nomisUserRolesApi/users/${userId}/roles`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        dpsRoles: ['WORK_READINESS_EDIT', 'EDUCATION_WORK_PLAN_EDITOR'],
      },
    },
  })

export default {
  getUserActiveCaseLoad,
  getStaffDetails,
  getUserRoles,
}
