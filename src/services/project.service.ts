
import { apiClient } from './api';
import { ProjectListDto, ErrorDto } from '../types/dtos';
import { AxiosError } from 'axios';

class ProjectService {
  async getAllProjects(): Promise<ProjectListDto> {
    try {
      const response = await apiClient.get<ProjectListDto>('/projects');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw error.response.data as ErrorDto;
      }
      throw new Error('Failed to fetch projects');
    }
  }
}

export const projectService = new ProjectService();
