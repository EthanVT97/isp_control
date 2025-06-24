
import React from 'react';
import SectionTitle from '../components/SectionTitle';
import { VIBER_BOT_TOKEN, MOCK_WEBHOOK_URL } from '../constants';
import { InformationCircleIcon, ShieldCheckIcon, ServerIcon, ClockIcon } from '@heroicons/react/24/outline';

const InfoRow: React.FC<{ label: string; value: string | React.ReactNode; sensitive?: boolean; icon?: React.ElementType }> = ({ label, value, sensitive, icon: Icon }) => (
  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium text-gray-600 flex items-center">
      {Icon && <Icon className="h-5 w-5 mr-2 text-gray-400" />}
      {label}
    </dt>
    <dd className={`mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 ${sensitive ? 'italic text-gray-500' : ''}`}>
      {sensitive ? '******************** (Sensitive)' : value}
    </dd>
  </div>
);

const BotConfigPage: React.FC = () => {
  return (
    <div>
      <SectionTitle title="Bot Configuration" subtitle="View your Viber bot's core settings." />

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Core Settings</h3>
          <dl className="divide-y divide-gray-200">
            <InfoRow label="Bot Name" value="My Awesome Viber Bot" icon={InformationCircleIcon} />
            <InfoRow label="Viber API Token" value={VIBER_BOT_TOKEN} sensitive icon={ShieldCheckIcon} />
            <InfoRow label="Webhook URL" value={<a href={MOCK_WEBHOOK_URL} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">{MOCK_WEBHOOK_URL}</a>} icon={ServerIcon} />
            <InfoRow label="Webhook Status" value={<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Connected & Secure (SSL)</span>} icon={ShieldCheckIcon} />
          </dl>
        </div>
      </div>

      <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Backend Managed Features</h3>
          <p className="text-sm text-gray-600 mb-4">
            The following critical features are managed by the backend system for security and reliability:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
            <li className="flex items-center"><ShieldCheckIcon className="h-5 w-5 mr-2 text-sky-500" /> Security Measures & Rate Limiting</li>
            <li className="flex items-center"><ServerIcon className="h-5 w-5 mr-2 text-sky-500" /> Error Logging & System Monitoring (Server-Side)</li>
            <li className="flex items-center"><ClockIcon className="h-5 w-5 mr-2 text-sky-500" /> User Session Management (Persistent)</li>
            <li className="flex items-center"><InformationCircleIcon className="h-5 w-5 mr-2 text-sky-500" /> Device ID Verification (Viber Specific)</li>
          </ul>
           <p className="mt-4 text-xs text-gray-500">
            This frontend provides an interface to configure aspects of these systems where applicable, but the core logic resides on the server.
          </p>
        </div>
      </div>
       <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <InformationCircleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm">
              Note: This is a UI simulation. Actual bot functionality, API interactions, and data persistence require a dedicated backend server integrated with the Viber API.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotConfigPage;
