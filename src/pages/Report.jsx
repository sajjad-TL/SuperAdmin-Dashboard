import { useState } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';
import { ChevronDown, Download, PlusCircle, Users, DollarSign, TrendingUp, Award } from 'lucide-react';
import Admin from '../layout/Adminnavbar';

const chartData = [
  { name: 'Jan', value: 245 },
  { name: 'Feb', value: 312 },
  { name: 'Mar', value: 278 },
  { name: 'Apr', value: 389 },
  { name: 'May', value: 345 },
  { name: 'Jun', value: 423 },
];

export default function ReportsDashboard() {
  const [timeRange] = useState('Last 6 Months');

  return (
   <>
   <Admin/>
    <div className="bg-gray-100 p-4 md:p-6 lg:p-10 min-h-screen">
      <div className=" px-10 mx-auto">
        {/* Header */}
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
            <button className="flex items-center px-3 py-2 text-sm text-white bg-blue-600 rounded shadow-sm hover:bg-blue-700">
              <PlusCircle size={16} className="mr-2" />
              Create Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard 
            title="Monthly Applications" 
            value="245" 
            change="+12.5%" 
            isPositive={true}
            icon={<div className="bg-blue-100 p-2 rounded-md"><TrendingUp size={20} className="text-blue-600" /></div>}
          />
          <MetricCard 
            title="Monthly Revenue" 
            value="$84,245" 
            change="+6.2%" 
            isPositive={true}
            icon={<div className="bg-green-100 p-2 rounded-md"><DollarSign size={20} className="text-green-600" /></div>}
          />
          <MetricCard 
            title="Active Agents" 
            value="156" 
            change="+3%" 
            isPositive={true}
            icon={<div className="bg-purple-100 p-2 rounded-md"><Users size={20} className="text-purple-600" /></div>}
          />
          <MetricCard 
            title="Success Rate" 
            value="76.5%" 
            change="+5.2%" 
            isPositive={true}
            icon={<div className="bg-orange-100 p-2 rounded-md"><Award size={20} className="text-orange-600" /></div>}
          />
        </div>

        {/* Charts and Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Applications Trend */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
              <div>
                <h2 className="font-medium text-gray-900">Applications Trend</h2>
                <p className="text-xs text-gray-500">Monthly application statistics</p>
              </div>
              <div className="flex items-center mt-2 sm:mt-0 space-x-4">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
                  <span className="text-xs text-gray-600">Total</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
                  <span className="text-xs text-gray-600">Approved</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                  <span className="text-xs text-gray-600">Rejected</span>
                </div>
                <button className="inline-flex items-center text-xs border px-2 py-1 rounded">
                  {timeRange}
                  <ChevronDown size={14} className="ml-1" />
                </button>
              </div>
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
              <div>
                <p className="text-xs text-gray-500">Total Applications</p>
                <p className="text-xl font-semibold">1,992</p>
                <p className="text-xs text-green-600">+15.3% vs last period</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Approval Rate</p>
                <p className="text-xl font-semibold">68.5%</p>
                <p className="text-xs text-green-600">+2.5% vs last period</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Average Processing Time</p>
                <p className="text-xl font-semibold">12 Days</p>
                <p className="text-xs text-red-600">+3 days vs last period</p>
              </div>
            </div>
          </div>

          {/* Top Source Countries */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="font-medium text-gray-900 mb-4">Top Source Countries</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium">India</p>
                  <p className="text-sm font-medium">75%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium">China</p>
                  <p className="text-sm font-medium">65%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium">Nigeria</p>
                  <p className="text-sm font-medium">45%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Programs */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="font-medium text-gray-900 mb-4">Popular Programs</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-md mr-3">
                    <div className="h-6 w-6 flex items-center justify-center text-blue-600">📚</div>
                  </div>
                  <div>
                    <p className="font-medium">Computer Science</p>
                    <p className="text-xs text-gray-500">University of Toronto</p>
                  </div>
                </div>
                <div className="text-sm font-medium">324 Applications</div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-md mr-3">
                    <div className="h-6 w-6 flex items-center justify-center text-green-600">💼</div>
                  </div>
                  <div>
                    <p className="font-medium">Business Administration</p>
                    <p className="text-xs text-gray-500">McGill University</p>
                  </div>
                </div>
                <div className="text-sm font-medium">256 Applications</div>
              </div>
            </div>
          </div>

          {/* Top Performing Agents */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="font-medium text-gray-900 mb-4">Top Performing Agents</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-gray-200 h-10 w-10 rounded-full overflow-hidden mr-3">
                    <img src="/api/placeholder/40/40" alt="John Smith" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium">John Smith</p>
                    <p className="text-xs text-gray-500">145 Applications</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-green-600">92% Success Rate</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-gray-200 h-10 w-10 rounded-full overflow-hidden mr-3">
                    <img src="/api/placeholder/40/40" alt="Sarah Johnson" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-xs text-gray-500">132 Applications</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-green-600">88% Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
   </>
  );
}

function MetricCard({ title, value, change, isPositive, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm text-gray-500">{title}</h3>
        {icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </p>
    </div>
  );
}