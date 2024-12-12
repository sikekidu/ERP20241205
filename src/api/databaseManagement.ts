import axios from 'axios';

export const fetchTableData = async (tableName: string): Promise<Record<string, unknown>[]> => {
  try {
    const response = await axios.get<FetchTableDataResponse>(`/api/database/${tableName}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching table data:', error);
    throw error;
  }
};

export const uploadTableData = async (tableName: string, file: File): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    await axios.post(`/api/database/${tableName}/upload`, formData);
  } catch (error) {
    console.error('Error uploading table data:', error);
    throw error;
  }
};

interface FetchTableDataResponse {
  data: Record<string, unknown>[];
}
