
import React from 'react';
import SectionTitle from '../components/SectionTitle';
import { Link } from 'react-router-dom';
import { Cog6ToothIcon, ChatBubbleLeftEllipsisIcon, MegaphoneIcon, UserGroupIcon, PresentationChartBarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface DashboardCardProps {
  title: string;
  description: string;
  link: string;
  icon: React.ElementType;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, description, link, icon: Icon }) => (
  <Link to={link} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 flex flex-col justify-between">
    <div>
      <div className="flex items-center text-sky-600 mb-3">
        <Icon className="h-8 w-8 mr-3" />
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
    </div>
    <div className="flex items-center text-sm text-sky-600 font-medium">
      Go to {title} <ArrowRightIcon className="h-4 w-4 ml-1" />
    </div>
  </Link>
);

const DashboardPage: React.FC = () => {
  return (
    <div>
      <SectionTitle title="Viber Bot Dashboard" subtitle="Manage and monitor your Viber bot activities." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Bot Configuration"
          description="View and manage basic bot settings, tokens, and webhook information."
          link="/config"
          icon={Cog6ToothIcon}
        />
        <DashboardCard
          title="Welcome Message"
          description="Design and customize the rich media welcome message for new users."
          link="/welcome"
          icon={ChatBubbleLeftEllipsisIcon}
        />
        <DashboardCard
          title="Auto-Reply System"
          description="Configure Q&A, manage AI responses, and test bot conversations."
          link="/auto-reply"
          icon={PresentationChartBarIcon}
        />
        <DashboardCard
          title="Broadcast Messages"
          description="Create, schedule, and send broadcast messages to user segments."
          link="/broadcast"
          icon={MegaphoneIcon}
        />
        <DashboardCard
          title="Customer Service"
          description="Handle customer registrations, support tickets, and payments."
          link="/customer-service"
          icon={UserGroupIcon}
        />
      </div>

      <div className="mt-12 p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Quick Stats (Simulated)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-sky-600">1,234</p>
            <p className="text-sm text-gray-500">Active Users</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-500">567</p>
            <p className="text-sm text-gray-500">Messages Today</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-yellow-500">89</p>
            <p className="text-sm text-gray-500">Open Tickets</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-red-500">3</p>
            <p className="text-sm text-gray-500">Errors Logged</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
