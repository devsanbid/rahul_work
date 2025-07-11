import StatsGrid from '../../component/dashboard/StatsGrid';
import RevenueChart from '../../component/dashboard/RevenueChart';
import RecentActivity from '../../component/dashboard/RecentActivity';
import RecentProjects from '../../component/dashboard/RecentProjects';

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <StatsGrid />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <RecentActivity />
      </div>
      
      <RecentProjects />
    </div>
  );
};

export default DashboardPage;