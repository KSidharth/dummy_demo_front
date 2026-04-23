
export interface AuthTokenDto {
  success: boolean;
  token: string;
  role: 'manager' | 'employee';
  email: string;
  message: string;
}

export interface ErrorDto {
  success: false;
  statusCode: number;
  message: string;
  errors?: ApiFieldErrorDto[] | null;
  errorCode?: string | null;
  timestamp: string;
  path: string;
}

export interface ApiFieldErrorDto {
  field: string;
  message: string;
  rejectedValue: string | null;
}

export interface ProjectDto {
  id: number;
  name: string;
}

export interface TeamDto {
  id: number;
  name: string;
}

export interface ProjectListDto {
  success: boolean;
  data: ProjectDto[];
  count: number;
}

export interface TeamListDto {
  success: boolean;
  data: TeamDto[];
  count: number;
}

export interface HikeSubmissionRequestDto {
  project: string;
  team: string;
  hike_of_employee_1: number;
  hike_of_employee_2: number;
  hike_of_employee_3: number;
  hike_of_employee_4: number;
  hike_of_employee_5: number;
  hike_of_employee_6: number;
  hike_of_employee_7: number;
  hike_of_employee_8: number;
  hike_of_employee_9: number;
  hike_of_employee_10: number;
}

export interface HikeStatisticsDto {
  highest_hike: number;
  lowest_hike: number;
  hike_average: number;
  total_spend: number;
}

export interface HikeSubmissionResultDto {
  success: boolean;
  message: string;
  recordId: number;
  project: string;
  team: string;
  statistics: HikeStatisticsDto;
  createdAt: string;
}

export interface HikeRecordDto {
  id: number;
  hike_of_employee_1: number;
  hike_of_employee_2: number;
  hike_of_employee_3: number;
  hike_of_employee_4: number;
  hike_of_employee_5: number;
  hike_of_employee_6: number;
  hike_of_employee_7: number;
  hike_of_employee_8: number;
  hike_of_employee_9: number;
  hike_of_employee_10: number;
  highest_hike: number;
  lowest_hike: number;
  hike_average: number;
  created_at: string;
}

export interface HikeRetrievalResponseDto {
  success: boolean;
  data: HikeRecordDto[];
  count: number;
  message: string;
}
