/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer'
import EmployerViewModel from './employerViewModel'

const testData: any = {
  id: '01907e1e-bb85-7bb7-9018-33a2070a367d',
  name: 'ASDA',
  description: 'Some text\r\nSome more text',
  sector: 'RETAIL',
  status: 'GOLD',
  createdAt: '2024-07-04T15:21:02.497176',
  createdBy: 'TEST_USER',
}

describe('EmployerViewModel', () => {
  const employerListViewModel: EmployerViewModel = plainToClass(EmployerViewModel, testData)

  it('should expose only specified properties', () => {
    expect(Object.keys(employerListViewModel)).toEqual(['id', 'name', 'description', 'createdAt', 'sector', 'status'])
  })

  it('should format releaseDate using formatDateStringToddMMMyyyy', () => {
    expect(employerListViewModel.createdAt).toEqual('4 Jul 2024')
  })
})
