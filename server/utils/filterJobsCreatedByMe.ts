import GetJobListItemResponse from '../data/jobApi/getJobListItemReaponse'

interface ResultSet {
  content: GetJobListItemResponse[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

// Function to filter jobs created by current user and return full result set
export default function filterResultSetByCreator(resultSet: ResultSet, createdBy: string): ResultSet {
  const filteredContent = resultSet.content.filter(job => job.createdBy === createdBy)

  return {
    content: filteredContent,
    page: {
      size: resultSet.page.size,
      number: 0, // reset to first page
      totalElements: filteredContent.length,
      totalPages: Math.ceil(filteredContent.length / resultSet.page.size) || 1,
    },
  }
}
