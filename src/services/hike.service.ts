
import { apiClient } from './api';
import {
  HikeSubmissionRequestDto,
  HikeSubmissionResultDto,
  HikeRetrievalResponseDto,
  ErrorDto,
} from '../types/dtos';
import { AxiosError } from 'axios';

class HikeService {
  async submitHikeData(data: HikeSubmissionRequestDto): Promise<HikeSubmissionResultDto> {
    try {
      const response = await apiClient.post<HikeSubmissionResultDto>('/hikes', data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw error.response.data as ErrorDto;
      }
      throw new Error('Failed to submit hike data');
    }
  }

  async getHikeData(project: string, team: string): Promise<HikeRetrievalResponseDto> {
    try {
      const response = await apiClient.get<HikeRetrievalResponseDto>('/hikes', {
        params: { project, team },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw error.response.data as ErrorDto;
      }
      throw new Error('Failed to retrieve hike data');
    }
  }
}

export const hikeService = new HikeService();
