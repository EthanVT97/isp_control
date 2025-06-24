
import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import { CustomerTicket } from '../types';
import { SERVICE_STATUS_OPTIONS } from '../constants';
import { PlusCircleIcon, TrashIcon, PencilSquareIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';

type ServiceStatusKey = keyof typeof SERVICE_STATUS_OPTIONS;

const CustomerServicePage: React.FC = () => {
  const { addLog } = useAppContext();
  const [tickets, setTickets] = useState<CustomerTicket[]>([]);
  const [currentTicket, setCurrentTicket] = useState<Partial<CustomerTicket>>({ status: 'Open' });
  const [isEditingTicket, setIsEditingTicket] = useState<boolean>(false);
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);

  // New Customer Registration State
  const [registration, setRegistration] = useState({ name: '', email: '', phone: '', deviceId: 'AUTO_VERIFIED_SIM' });
  // Bill Payment State
  const [payment, setPayment] = useState({ accountNumber: '', amount: '', paymentMethod: 'Credit Card' });


  const handleTicketInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentTicket(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTicket.userName || !currentTicket.email || !currentTicket.subject || !currentTicket.description) {
      alert('All ticket fields are required.');
      return;
    }
    if (isEditingTicket && editingTicketId) {
      setTickets(prevs => prevs.map(t => t.id === editingTicketId ? { ...currentTicket, id: editingTicketId, createdAt: t.createdAt } as CustomerTicket : t));
      addLog(`Support ticket updated: "${currentTicket.subject}"`, 'info');
    } else {
      const newTicket = { ...currentTicket, id: Date.now().toString(), createdAt: new Date() } as CustomerTicket;
      setTickets(prevs => [newTicket, ...prevs]); // Add to top
      addLog(`New support ticket created: "${newTicket.subject}"`, 'info');
    }
    setCurrentTicket({ status: 'Open' });
    setIsEditingTicket(false);
    setEditingTicketId(null);
  };

  const handleEditTicket = (ticket: CustomerTicket) => {
    setCurrentTicket(ticket);
    setIsEditingTicket(true);
    setEditingTicketId(ticket.id);
  };

  const handleDeleteTicket = (id: string) => {
    const ticketToDel = tickets.find(t=>t.id === id);
    setTickets(prevs => prevs.filter(t => t.id !== id));
    if(ticketToDel) addLog(`Support ticket deleted: "${ticketToDel.subject}"`, 'info');
  };
  
  const handleRegistrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegistration(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate registration
    addLog(`New customer registration (simulated): ${registration.name} - ${registration.email}`, 'info');
    alert(`Simulated registration for ${registration.name}. Device ID: ${registration.deviceId}. Check logs.`);
    setRegistration({ name: '', email: '', phone: '', deviceId: 'AUTO_VERIFIED_SIM' });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPayment(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handlePayBill = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate payment
    addLog(`Internet bill payment (simulated): Account ${payment.accountNumber}, Amount ${payment.amount}`, 'api');
    alert(`Simulated payment for account ${payment.accountNumber} of ${payment.amount} via ${payment.paymentMethod}. Check logs.`);
    setPayment({ accountNumber: '', amount: '', paymentMethod: 'Credit Card' });
  };

  const getStatusColor = (status: CustomerTicket['status']) => {
    switch (status) {
      case 'Open': return 'text-red-600 bg-red-100';
      case 'In Progress': return 'text-yellow-600 bg-yellow-100';
      case 'Resolved': return 'text-green-600 bg-green-100';
      case 'Closed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  useEffect(() => {
    addLog('Customer Service module loaded.', 'info');
  }, [addLog]);


  return (
    <div>
      <SectionTitle title="Customer Service Center" subtitle="Manage registrations, support tickets, payments, and check service status (Simulated)." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* New Customer Registration */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">New Customer Registration</h3>
          <form onSubmit={handleRegister} className="space-y-3">
            <input type="text" name="name" placeholder="Full Name" value={registration.name} onChange={handleRegistrationChange} className="w-full p-2 border rounded-md" required />
            <input type="email" name="email" placeholder="Email Address" value={registration.email} onChange={handleRegistrationChange} className="w-full p-2 border rounded-md" required />
            <input type="tel" name="phone" placeholder="Phone Number" value={registration.phone} onChange={handleRegistrationChange} className="w-full p-2 border rounded-md" />
            <input type="text" name="deviceId" placeholder="Device ID" value={registration.deviceId} onChange={handleRegistrationChange} className="w-full p-2 border rounded-md bg-gray-100" readOnly title="Device ID is typically auto-verified by backend" />
            <button type="submit" className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600">Register Customer</button>
          </form>
        </div>

        {/* Internet Bill Payment */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Internet Bill Payment</h3>
          <form onSubmit={handlePayBill} className="space-y-3">
            <input type="text" name="accountNumber" placeholder="Account Number" value={payment.accountNumber} onChange={handlePaymentChange} className="w-full p-2 border rounded-md" required />
            <input type="number" name="amount" placeholder="Amount (MMK)" value={payment.amount} onChange={handlePaymentChange} className="w-full p-2 border rounded-md" required />
            <select name="paymentMethod" value={payment.paymentMethod} onChange={handlePaymentChange} className="w-full p-2 border rounded-md">
              <option>Credit Card</option>
              <option>Mobile Banking</option>
              <option>WavePay</option>
            </select>
            <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">Pay Bill</button>
          </form>
        </div>
        
        {/* Service Status Checker */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Service Status</h3>
          <ul className="space-y-2">
            {Object.entries(SERVICE_STATUS_OPTIONS).map(([service, status]) => (
              <li key={service} className="flex justify-between items-center text-sm p-2 rounded-md bg-gray-50">
                <span className="capitalize text-gray-700">{service.replace('_', ' ')}:</span>
                <span className={`font-semibold ${status === 'Operational' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {status === 'Operational' ? <CheckCircleIcon className="h-5 w-5 inline mr-1" /> : <ExclamationTriangleIcon className="h-5 w-5 inline mr-1" />}
                  {status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Support Ticket System */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Support Ticket System</h3>
        <form onSubmit={handleSubmitTicket} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
          <input type="text" name="userName" placeholder="User Name" value={currentTicket.userName || ''} onChange={handleTicketInputChange} className="p-2 border rounded-md" required />
          <input type="email" name="email" placeholder="User Email" value={currentTicket.email || ''} onChange={handleTicketInputChange} className="p-2 border rounded-md" required />
          <input type="text" name="subject" placeholder="Subject" value={currentTicket.subject || ''} onChange={handleTicketInputChange} className="md:col-span-2 p-2 border rounded-md" required />
          <textarea name="description" placeholder="Description of Issue" value={currentTicket.description || ''} onChange={handleTicketInputChange} rows={3} className="md:col-span-2 p-2 border rounded-md" required />
          <div>
            <label htmlFor="status" className="block text-xs font-medium text-gray-600">Status</label>
            <select name="status" id="status" value={currentTicket.status || 'Open'} onChange={handleTicketInputChange} className="w-full p-2 border rounded-md">
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div className="md:col-span-2 flex justify-end space-x-3">
             {isEditingTicket && (
              <button type="button" onClick={() => { setIsEditingTicket(false); setCurrentTicket({ status: 'Open' }); setEditingTicketId(null);}} className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md shadow-sm hover:bg-gray-300">
                Cancel Edit
              </button>
            )}
            <button type="submit" className="flex items-center justify-center px-4 py-2 bg-sky-600 text-white font-semibold rounded-md shadow-md hover:bg-sky-700">
              <PlusCircleIcon className="h-5 w-5 mr-2" /> {isEditingTicket ? 'Update Ticket' : 'Create Ticket'}
            </button>
          </div>
        </form>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {tickets.length === 0 && <p className="text-sm text-gray-500">No support tickets yet.</p>}
          {tickets.map(ticket => (
            <div key={ticket.id} className="p-4 border border-gray-200 rounded-md bg-white hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-800">{ticket.subject}</h4>
                  <p className="text-sm text-gray-600">User: {ticket.userName} ({ticket.email})</p>
                  <p className="text-xs text-gray-500 mt-1">Submitted: {new Date(ticket.createdAt).toLocaleString()}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>{ticket.status}</span>
              </div>
              <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{ticket.description}</p>
              <div className="mt-3 text-right space-x-2">
                <button onClick={() => handleEditTicket(ticket)} className="text-xs text-yellow-600 hover:text-yellow-800 p-1 rounded hover:bg-yellow-100">
                   <PencilSquareIcon className="h-4 w-4 inline-block"/> Edit
                </button>
                <button onClick={() => handleDeleteTicket(ticket.id)} className="text-xs text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100">
                   <TrashIcon className="h-4 w-4 inline-block"/> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
       <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <InformationCircleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm">
              All customer service operations are simulated. Real implementation requires secure backend processing for registration, payments, and ticket management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerServicePage;
