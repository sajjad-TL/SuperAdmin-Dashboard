import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';
import {
  ChevronDown,
  Download,
  PlusCircle,
  Users,
  DollarSign,
  TrendingUp,
  Award,
  X
} from 'lucide-react';
import Admin from '../layout/Adminnavbar';
import axios from 'axios';

export default function ReportsDashboard() {
  const [timeRange] = useState('Last 6 Months');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reports/getReport');
      if (res.data && res.data.length > 0) {
        setReportData(res.data[0]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching report:', err);
      setLoading(false);
    }
  };

  const handleCreateReport = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/reports/createReport');
      if (res.status === 201) {
        alert('Report created successfully');
        setIsModalOpen(false);
        fetchReports();
      }
    } catch (error) {
      alert('Error creating report: ' + error.message);
    }
  };

  const chartData = [
    { name: reportData?.month || 'N/A', value: reportData?.chartValue || 0 }
  ];

  return (
    <>
      <Admin />
      <div className="bg-gray-100 p-4 md:p-6 lg:p-10 min-h-screen">
        <div className="px-10 mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-sm text-gray-600">Comprehensive insights and analysis</p>
            </div>
            <div className="flex mt-4 md:mt-0 space-x-2">
              <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded shadow-sm bg-white hover:bg-gray-50">
                <Download size={16} className="mr-2" />
                Export Reports
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center px-3 py-2 text-sm text-white bg-blue-600 rounded shadow-sm hover:bg-blue-700"
              >
                <PlusCircle size={16} className="mr-2" />
                Create Report
              </button>
            </div>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
                <button
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setIsModalOpen(false)}
                >
                  <X size={20} />
                </button>
                <h2 className="text-xl font-semibold mb-4">Generate Monthly Report</h2>
                <p className="text-sm text-gray-500 mb-4">
                  This will automatically generate the latest report based on current data.
                </p>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={handleCreateReport}
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>
          )}

          {!loading && reportData ? (
            <ReportContent timeRange={timeRange} chartData={chartData} reportData={reportData} />
          ) : (
            <p className="text-center text-gray-500 mt-10">Loading report...</p>
          )}
        </div>
      </div>
    </>
  );
}

function ReportContent({ timeRange, chartData, reportData }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Monthly Applications" value={reportData.monthlyApplications} change="+12.5%" isPositive={true} icon={<IconWrapper><TrendingUp size={20} className="text-blue-600" /></IconWrapper>} />
        <MetricCard title="Monthly Revenue" value={`$${reportData.monthlyRevenue}`} change="+6.2%" isPositive={true} icon={<IconWrapper><DollarSign size={20} className="text-green-600" /></IconWrapper>} />
        <MetricCard title="Active Agents" value={reportData.activeAgents} change="+3%" isPositive={true} icon={<IconWrapper><Users size={20} className="text-purple-600" /></IconWrapper>} />
        <MetricCard title="Success Rate" value={`${reportData.successRate}%`} change="+5.2%" isPositive={true} icon={<IconWrapper><Award size={20} className="text-orange-600" /></IconWrapper>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex justify-between mb-4">
            <div>
              <h2 className="font-medium text-gray-900">Applications Trend</h2>
              <p className="text-xs text-gray-500">Monthly application statistics</p>
            </div>
            <button className="inline-flex items-center text-xs border px-2 py-1 rounded">
              {timeRange}
              <ChevronDown size={14} className="ml-1" />
            </button>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
            <Stat title="Total Applications" value={reportData.totalApplications} />
            <Stat title="Approval Rate" value={`${reportData.approvalRate}%`} />
            <Stat title="Avg Processing Time" value={`${reportData.processingTimeDays} Days`} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="font-medium text-gray-900 mb-4">Top Source Countries</h2>
          <div className="space-y-4">
            {reportData.sourceCountries?.map((c, i) => (
              <ProgressBar key={i} label={c.country} percent={c.percentage} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgramList title="Popular Programs" data={reportData.popularPrograms} />
        <AgentList title="Top Performing Agents" data={reportData.topAgents} />
      </div>
    </>
  );
}

const MetricCard = ({ title, value, change, isPositive, icon }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-sm text-gray-500">{title}</h3>
      {icon}
    </div>
    <p className="text-2xl font-bold">{value}</p>
    <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{change}</p>
  </div>
);

const IconWrapper = ({ children }) => (
  <div className="bg-gray-100 p-2 rounded-md">{children}</div>
);

const Stat = ({ title, value }) => (
  <div>
    <p className="text-xs text-gray-500">{title}</p>
    <p className="text-xl font-semibold">{value}</p>
  </div>
);

const ProgressBar = ({ label, percent }) => (
  <div>
    <div className="flex justify-between mb-1">
      <p className="text-sm font-medium">{label}</p>
      <p className="text-sm font-medium">{percent}%</p>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percent}%` }}></div>
    </div>
  </div>
);

const ProgramList = ({ title, data }) => (
  <div className="bg-white rounded-lg shadow p-4 md:p-6">
    <h2 className="font-medium text-gray-900 mb-4">{title}</h2>
    <div className="space-y-4">
      {data?.map((program, i) => (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg" key={i}>
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-md mr-3">
              <div className="h-6 w-6 flex items-center justify-center text-blue-600">📚</div>
            </div>
            <div>
              <p className="font-medium">{program.program}</p>
              <p className="text-xs text-gray-500">{program.university}</p>
            </div>
          </div>
          <div className="text-sm font-medium">{program.applications} Applications</div>
        </div>
      ))}
    </div>
  </div>
);

const AgentList = ({ title, data }) => (
  <div className="bg-white rounded-lg shadow p-4 md:p-6">
    <h2 className="font-medium text-gray-900 mb-4">{title}</h2>
    <div className="space-y-4">
      {data?.map((agent, i) => (
        <div className="flex items-center justify-between" key={i}>
          <div className="flex items-center">
            <div className="bg-gray-200 h-10 w-10 rounded-full overflow-hidden mr-3">
              <img src={agent.avatar || '/api/placeholder/40/40'} alt={agent.name} className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="font-medium">{agent.name}</p>
              <p className="text-xs text-gray-500">{agent.applications} Applications</p>
            </div>
          </div>
          <div className="text-sm font-medium text-green-600">{agent.successRate}% Success Rate</div>
        </div>
      ))}
    </div>
  </div>
);
