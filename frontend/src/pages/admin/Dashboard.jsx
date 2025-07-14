import StatsGrid from '../../components/Admincomponents/dashboard/StatsGrid';
import RevenueChart from '../../components/Admincomponents/dashboard/RevenueChart';
import RecentActivity from '../../components/Admincomponents/dashboard/RecentActivity';
import RecentProjects from '../../components/Admincomponents/dashboard/RecentProjects';

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