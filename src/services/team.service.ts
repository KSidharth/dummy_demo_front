
import { apiClient } from './api';
import { TeamListDto, ErrorDto } from '../types/dtos';
import { AxiosError } from 'axios';

class TeamService {
  async getAllTeams(): Promise<TeamListDto> {
    try {
      const response = await apiClient.get<TeamListDto>('/teams');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw error.response.data as ErrorDto;
      }
      throw new Error('Failed to fetch teams');
    }
  }
}

export const teamService = new TeamService();
