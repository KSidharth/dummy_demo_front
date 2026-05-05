
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PageLayout from '../components/PageLayout';
import { projectService } from '../services/project.service';
import { teamService } from '../services/team.service';
import { hikeService } from '../services/hike.service';
import { ProjectDto, TeamDto, HikeStatisticsDto, ErrorDto } from '../types/dtos';

const hikeSchema = z.object({
  project: z.string().min(1, 'Project is required'),
  team: z.string().min(1, 'Team is required'),
  hike_of_employee_1: z.number().min(0).max(50, 'Must be between 0 and 50'),
  hike_of_employee_2: z.number().min(0).max(50, 'Must be between 0 and 50'),
  hike_of_employee_3: z.number().min(0).max(50, 'Must be between 0 and 50'),
  hike_of_employee_4: z.number().min(0).max(50, 'Must be between 0 and 50'),
  hike_of_employee_5: z.number().min(0).max(50, 'Must be between 0 and 50'),
  hike_of_employee_6: z.number().min(0).max(50, 'Must be between 0 and 50'),
  hike_of_employee_7: z.number().min(0).max(50, 'Must be between 0 and 50'),
  hike_of_employee_8: z.number().min(0).max(50, 'Must be between 0 and 50'),
  hike_of_employee_9: z.number().min(0).max(50, 'Must be between 0 and 50'),
  hike_of_employee_10: z.number().min(0).max(50, 'Must be between 0 and 50'),
});

type HikeFormData = z.infer<typeof hikeSchema>;

const ManagerDashboard: React.FC = () => {
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [teams, setTeams] = useState<TeamDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [statistics, setStatistics] = useState<HikeStatisticsDto | null>(null);
  const [showHikeFields, setShowHikeFields] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<HikeFormData>({
    resolver: zodResolver(hikeSchema),
    defaultValues: {
      project: '',
      team: '',
      hike_of_employee_1: 0,
      hike_of_employee_2: 0,
      hike_of_employee_3: 0,
      hike_of_employee_4: 0,
      hike_of_employee_5: 0,
      hike_of_employee_6: 0,
      hike_of_employee_7: 0,
      hike_of_employee_8: 0,
      hike_of_employee_9: 0,
      hike_of_employee_10: 0,
    },
  });

  const selectedProject = watch('project');
  const selectedTeam = watch('team');

  useEffect(() => {
    if (selectedProject && selectedTeam) {
      setShowHikeFields(true);
    } else {
      setShowHikeFields(false);
    }
  }, [selectedProject, selectedTeam]);

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

  const onSubmit = async (data: HikeFormData) => {
    setSubmitting(true);
    setError('');
    setStatistics(null);

    try {
      const response = await hikeService.submitHikeData(data);
      setStatistics(response.statistics);
      reset({
        ...data,
        hike_of_employee_1: 0,
        hike_of_employee_2: 0,
        hike_of_employee_3: 0,
        hike_of_employee_4: 0,
        hike_of_employee_5: 0,
        hike_of_employee_6: 0,
        hike_of_employee_7: 0,
        hike_of_employee_8: 0,
        hike_of_employee_9: 0,
        hike_of_employee_10: 0,
      });
    } catch (err) {
      const apiError = err as ErrorDto;
      setError(apiError.message || 'Failed to submit hike data');
    } finally {
      setSubmitting(false);
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
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Manager Dashboard</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {statistics && (
          <div className="bg-green-100 border border-green-400 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-bold text-green-800 mb-4">AI-Computed Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <p className="text-sm text-gray-600">Highest Hike</p>
                <p className="text-2xl font-bold text-gray-800">{statistics.highest_hike}k</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <p className="text-sm text-gray-600">Lowest Hike</p>
                <p className="text-2xl font-bold text-gray-800">{statistics.lowest_hike}k</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <p className="text-sm text-gray-600">Average Hike</p>
                <p className="text-2xl font-bold text-gray-800">{statistics.hike_average.toFixed(2)}k</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <p className="text-sm text-gray-600">Total Spend</p>
                <p className="text-2xl font-bold text-gray-800">{statistics.total_spend}k</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
              <select
                {...register('project')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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

          {showHikeFields && (
            <>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Employee Hike Data</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <div key={num}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hike of Employee {num}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`hike_of_employee_${num}` as any, { valueAsNumber: true })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0-50"
                    />
                    {errors[`hike_of_employee_${num}` as keyof HikeFormData] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`hike_of_employee_${num}` as keyof HikeFormData]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Hike Data'}
              </button>
            </>
          )}
        </form>
      </div>
    </PageLayout>
  );
};

export default ManagerDashboard;
