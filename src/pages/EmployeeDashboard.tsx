
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PageLayout from '../components/PageLayout';
import { projectService } from '../services/project.service';
import { teamService } from '../services/team.service';
import { hikeService } from '../services/hike.service';
import { ProjectDto, TeamDto, HikeRecordDto, ErrorDto } from '../types/dtos';

const querySchema = z.object({
  project: z.string().min(1, 'Project is required'),
  team: z.string().min(1, 'Team is required'),
});

type QueryFormData = z.infer<typeof querySchema>;

const EmployeeDashboard: React.FC = () => {
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [teams, setTeams] = useState<TeamDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [querying, setQuerying] = useState(false);
  const [hikeRecords, setHikeRecords] = useState<HikeRecordDto[]>([]);
  const [hasQueried, setHasQueried] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QueryFormData>({
    resolver: zodResolver(querySchema),
    defaultValues: {
      project: '',
      team: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, teamsData] = await Promise.all([
          projectService.getAllProjects(),
          teamService.getAllTeams(),
        ]);
        setProjects(projectsData.data);
        setTeams(teamsData.data);
      } catch (err) {
        const apiError = err as ErrorDto;
        setError(apiError.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: QueryFormData) => {
    setQuerying(true);
    setError('');
    setHikeRecords([]);
    setHasQueried(false);

    try {
      const response = await hikeService.getHikeData(data.project, data.team);
      setHikeRecords(response.data);
      setHasQueried(true);
    } catch (err) {
      const apiError = err as ErrorDto;
      setError(apiError.message || 'Failed to retrieve hike data');
      setHasQueried(true);
    } finally {
      setQuerying(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Employee Dashboard</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
              <select
                {...register('project')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.name}>
                    {project.name}
                  </option>
                ))}
              </select>
              {errors.project && (
                <p className="text-red-500 text-sm mt-1">{errors.project.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Team</label>
              <select
                {...register('team')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </select>
              {errors.team && <p className="text-red-500 text-sm mt-1">{errors.team.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={querying}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {querying ? 'Loading...' : 'View Hike Data'}
          </button>
        </form>

        {hasQueried && hikeRecords.length === 0 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
            No hike records found for the selected project and team.
          </div>
        )}

        {hikeRecords.length > 0 && (
          <div className="space-y-6">
            {hikeRecords.map((record) => (
              <div key={record.id} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Hike Record (Submitted: {new Date(record.created_at).toLocaleDateString()})
                </h3>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Employee Hike Percentages</h4>
                  <div className="grid grid-cols-5 gap-3">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                      <div key={num} className="bg-gray-50 p-3 rounded border border-gray-200">
                        <p className="text-xs text-gray-600">Employee {num}</p>
                        <p className="text-lg font-bold text-gray-800">
                          {record[`hike_of_employee_${num}` as keyof HikeRecordDto]}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded border border-blue-200">
                    <p className="text-sm text-gray-600">Highest Hike</p>
                    <p className="text-2xl font-bold text-blue-800">{record.highest_hike}%</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded border border-red-200">
                    <p className="text-sm text-gray-600">Lowest Hike</p>
                    <p className="text-2xl font-bold text-red-800">{record.lowest_hike}%</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded border border-green-200">
                    <p className="text-sm text-gray-600">Average Hike</p>
                    <p className="text-2xl font-bold text-green-800">
                      {record.hike_average.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default EmployeeDashboard;
