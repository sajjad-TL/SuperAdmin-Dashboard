// -------------------- ReportsDashboard.jsx --------------------
import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
  Tooltip, CartesianGrid
} from 'recharts';
import {
  Download,
  PlusCircle,
  Users,
  DollarSign,
  TrendingUp,
  Award,
} from 'lucide-react';
import Admin from '../layout/Adminnavbar';
import axios from 'axios';

export default function ReportsDashboard() {
  const [timeRange, setTimeRange] = useState('6m');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reports/getReport?range=${timeRange}`);
      const data = Array.isArray(res.data) ? res.data : [];
      setReportData(data);
    } catch (err) {
      console.error('Error fetching report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [timeRange]);

  const handleCreateReport = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/reports/createReport');
      if (res.status === 201 && res.data) {
        alert('Report created successfully');
        setReportData(prev => [...prev, res.data]);
      }
    } catch (error) {
      alert('Error creating report: ' + error.message);
    }
  };

  const handleExportReport = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reports/exportExcel?range=${timeRange}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${timeRange}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export report: ' + err.message);
    }
  };

  // -------------------- Chart Data --------------------
const chartData = Array.isArray(reportData)
  ? reportData.map((r, i) => {
      const revenueValue = Number(r.monthlyRevenue ?? 0);
      return {
        name: r.month && r.year ? `${r.month} ${r.year}` : r.date || `Month ${i + 1}`,
        value: revenueValue > 0 ? revenueValue : 1,
      };
    })
  : [];


  const latestReport = reportData?.[reportData.length - 1] || {};

  const mergedProgramsMap = new Map();
  const mergedAgentsMap = new Map();

  reportData.forEach(report => {
    report.popularPrograms?.forEach(p => {
      const key = `${p.program}-${p.university}`;
      if (!mergedProgramsMap.has(key)) mergedProgramsMap.set(key, { ...p });
      else mergedProgramsMap.get(key).applications += p.applications;
    });

    report.topAgents?.forEach(a => {
      const key = a.name;
      if (!mergedAgentsMap.has(key)) mergedAgentsMap.set(key, { ...a });
      else {
        const existing = mergedAgentsMap.get(key);
        existing.applications += a.applications;
        existing.successRate = Math.round((existing.successRate + a.successRate) / 2);
      }
    });
  });

  const mergedPrograms = Array.from(mergedProgramsMap.values());
  const mergedAgents = Array.from(mergedAgentsMap.values());

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
              <button
                onClick={handleExportReport}
                className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded shadow-sm bg-white hover:bg-gray-50"
              >
                <Download size={16} className="mr-2" />
                Export Reports
              </button>
              <button
                onClick={handleCreateReport}
                className="flex items-center px-3 py-2 text-sm text-white bg-blue-600 rounded shadow-sm hover:bg-blue-700"
              >
                <PlusCircle size={16} className="mr-2" />
                Create Report
              </button>
            </div>
          </div>

          {!loading && reportData.length > 0 ? (
            <ReportContent
              chartData={chartData}
              reportData={latestReport}
              timeRange={timeRange}
              setTimeRange={setTimeRange}
              mergedPrograms={mergedPrograms}
              mergedAgents={mergedAgents}
            />
          ) : (
            <p className="text-center text-gray-500 mt-10">
              {loading ? 'Loading report...' : 'No report data available'}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

// -------------------- ReportContent Component --------------------
function ReportContent({ chartData, reportData, timeRange, setTimeRange, mergedPrograms, mergedAgents }) {
  // Helper to format currency
  const formatCurrency = (value) => {
    if (!value) return '$0';
    return `$${Number(value).toLocaleString()}`;
  };

  return (
    <>
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Monthly Applications" value={reportData.monthlyApplications ?? 0} change="+12.5%" isPositive={true} icon={<IconWrapper><TrendingUp size={20} className="text-blue-600" /></IconWrapper>} />
        <MetricCard title="Monthly Revenue" value={formatCurrency(reportData.monthlyRevenue)} change="+6.2%" isPositive={true} icon={<IconWrapper><DollarSign size={20} className="text-green-600" /></IconWrapper>} />
        <MetricCard title="Active Agents" value={reportData.activeAgents ?? 0} change="+3%" isPositive={true} icon={<IconWrapper><Users size={20} className="text-purple-600" /></IconWrapper>} />
        <MetricCard title="Success Rate" value={`${reportData.successRate ?? 0}%`} change="+5.2%" isPositive={true} icon={<IconWrapper><Award size={20} className="text-orange-600" /></IconWrapper>} />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="font-medium text-gray-900">Applications Trend</h2>
            <p className="text-xs text-gray-500">Monthly application statistics</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-xs border px-2 py-1 rounded"
          >
            <option value="1m">Last 1 Month</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
          </select>
        </div>

        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              barSize={50}
              barCategoryGap="30%"
              margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <Bar
                dataKey="value"
                fill="url(#blueGradient)"
                radius={[6, 6, 0, 0]}
                isAnimationActive={true}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Programs & Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgramList title="Popular Programs" data={mergedPrograms} />
        <AgentList title="Top Performing Agents" data={mergedAgents} />
      </div>
    </>
  );
}

// -------------------- Reusable Components --------------------
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
