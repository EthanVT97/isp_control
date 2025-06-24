
import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import { BroadcastMessage, MessageMediaType } from '../types';
import { USER_SEGMENTS } from '../constants';
import { PlusCircleIcon, TrashIcon, PencilSquareIcon, PaperAirplaneIcon, PhotoIcon, VideoCameraIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';

const BroadcastPage: React.FC = () => {
  const { addLog } = useAppContext();
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>([]);
  const [currentBroadcast, setCurrentBroadcast] = useState<Partial<BroadcastMessage>>({
    content: '',
    mediaType: MessageMediaType.TEXT,
    segments: [],
    status: 'Draft',
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentBroadcast(prev => ({ ...prev, [name]: value }));
  };

  const handleSegmentChange = (segmentId: string) => {
    setCurrentBroadcast(prev => {
      const currentSegments = prev.segments || [];
      const newSegments = currentSegments.includes(segmentId)
        ? currentSegments.filter(s => s !== segmentId)
        : [...currentSegments, segmentId];
      return { ...prev, segments: newSegments };
    });
  };

  const handleSubmitBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBroadcast.content || (currentBroadcast.mediaType !== MessageMediaType.TEXT && !currentBroadcast.mediaUrl)) {
      if(currentBroadcast.mediaType !== MessageMediaType.TEXT && !currentBroadcast.mediaUrl) {
        alert('Media URL is required for Image, Video, or Document types.');
      } else {
        alert('Content is required.');
      }
      return;
    }
    if (!currentBroadcast.segments || currentBroadcast.segments.length === 0) {
      alert('At least one user segment must be selected.');
      return;
    }

    if (isEditing && editingId) {
      setBroadcasts(prevs => prevs.map(b => b.id === editingId ? { ...currentBroadcast, id: editingId, status: 'Draft' } as BroadcastMessage : b));
      addLog(`Broadcast message updated: "${currentBroadcast.content?.substring(0,30)}..."`, 'info');
    } else {
      const newBroadcast = { ...currentBroadcast, id: Date.now().toString(), status: 'Draft' } as BroadcastMessage;
      setBroadcasts(prevs => [...prevs, newBroadcast]);
      addLog(`New broadcast message drafted: "${newBroadcast.content.substring(0,30)}..."`, 'info');
    }
    setCurrentBroadcast({ content: '', mediaType: MessageMediaType.TEXT, segments: [], status: 'Draft' });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEditBroadcast = (broadcast: BroadcastMessage) => {
    setCurrentBroadcast(broadcast);
    setIsEditing(true);
    setEditingId(broadcast.id);
  };

  const handleDeleteBroadcast = (id: string) => {
    const itemToDel = broadcasts.find(b => b.id === id);
    setBroadcasts(prevs => prevs.filter(b => b.id !== id));
    if(itemToDel) addLog(`Broadcast message deleted: "${itemToDel.content.substring(0,30)}..."`, 'info');
  };
  
  const handleSendBroadcast = (id: string) => {
    setBroadcasts(prevs => prevs.map(b => b.id === id ? {...b, status: 'Sent', scheduledAt: new Date()} : b));
    const sentItem = broadcasts.find(b => b.id === id);
    if(sentItem) {
        addLog(`Broadcast message SENT (simulated): "${sentItem.content.substring(0,30)}..."`, 'api');
        alert(`Simulating sending broadcast: "${sentItem.content.substring(0,20)}..."`);
    }
  };

  useEffect(() => {
    addLog('Broadcast system loaded.', 'info');
  }, [addLog]);

  const MediaIcon = ({ type }: { type: MessageMediaType }) => {
    switch (type) {
      case MessageMediaType.IMAGE: return <PhotoIcon className="h-5 w-5 text-purple-500" />;
      case MessageMediaType.VIDEO: return <VideoCameraIcon className="h-5 w-5 text-red-500" />;
      case MessageMediaType.DOCUMENT: return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
      default: return null;
    }
  };


  return (
    <div>
      <SectionTitle title="Broadcast System" subtitle="Create, manage, and send messages to user segments." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Broadcast Composer Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">{isEditing ? 'Edit Broadcast Message' : 'Compose New Broadcast'}</h3>
          <form onSubmit={handleSubmitBroadcast} className="space-y-6">
            <div>
              <label htmlFor="mediaType" className="block text-sm font-medium text-gray-700">Message Type</label>
              <select name="mediaType" id="mediaType" value={currentBroadcast.mediaType} onChange={handleInputChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500">
                {Object.values(MessageMediaType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {currentBroadcast.mediaType !== MessageMediaType.TEXT && (
              <div>
                <label htmlFor="mediaUrl" className="block text-sm font-medium text-gray-700">Media URL (for Image, Video, Document)</label>
                <input type="url" name="mediaUrl" id="mediaUrl" value={currentBroadcast.mediaUrl || ''} onChange={handleInputChange} placeholder="https://example.com/image.png" className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
            )}
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                {currentBroadcast.mediaType === MessageMediaType.TEXT ? 'Text Message Content' : 'Caption / Text (Optional for media)'}
              </label>
              <textarea name="content" id="content" value={currentBroadcast.content || ''} onChange={handleInputChange} rows={5} placeholder="Enter your message here..." className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Segments</label>
              <div className="grid grid-cols-2 gap-2 mt-1 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-md">
                {USER_SEGMENTS.map(segment => (
                  <label key={segment.id} className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded">
                    <input type="checkbox" checked={(currentBroadcast.segments || []).includes(segment.id)} onChange={() => handleSegmentChange(segment.id)} className="rounded text-sky-600 focus:ring-sky-500" />
                    <span className="text-sm text-gray-700">{segment.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <button type="submit" className="w-full flex items-center justify-center px-4 py-2.5 bg-sky-600 text-white font-semibold rounded-md shadow-md hover:bg-sky-700">
              <PlusCircleIcon className="h-5 w-5 mr-2" /> {isEditing ? 'Update Draft' : 'Save as Draft'}
            </button>
            {isEditing && (
              <button type="button" onClick={() => { setIsEditing(false); setCurrentBroadcast({ content: '', mediaType: MessageMediaType.TEXT, segments: [], status: 'Draft' }); setEditingId(null);}} className="w-full mt-2 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md shadow-md hover:bg-gray-300">
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/* Saved Broadcasts Section */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Saved Broadcasts</h3>
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
            {broadcasts.length === 0 && <p className="text-sm text-gray-500">No broadcasts drafted yet.</p>}
            {broadcasts.map(b => (
              <div key={b.id} className="p-3 border border-gray-200 rounded-md hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <MediaIcon type={b.mediaType} />
                      <p className="font-medium text-gray-700 ml-1 truncate" title={b.content}>{b.content.substring(0, 50)}{b.content.length > 50 ? '...' : ''}</p>
                    </div>
                    {b.mediaUrl && <p className="text-xs text-gray-500 truncate">URL: {b.mediaUrl}</p>}
                    <p className="text-xs text-gray-500">Segments: {b.segments.map(sId => USER_SEGMENTS.find(s=>s.id === sId)?.name || sId).join(', ')}</p>
                    <p className={`text-xs mt-1 font-semibold ${b.status === 'Sent' ? 'text-green-600' : b.status === 'Scheduled' ? 'text-yellow-600' : 'text-gray-500'}`}>
                      Status: {b.status} {b.status === 'Sent' && b.scheduledAt ? `(${b.scheduledAt.toLocaleString()})` : ''}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-1 ml-2">
                    {b.status === 'Draft' && (
                       <>
                        <button onClick={() => handleSendBroadcast(b.id)} title="Send Now" className="p-1.5 text-green-500 hover:text-green-700 rounded hover:bg-green-100">
                            <PaperAirplaneIcon className="h-4 w-4"/>
                        </button>
                        <button onClick={() => handleEditBroadcast(b)} title="Edit" className="p-1.5 text-yellow-500 hover:text-yellow-700 rounded hover:bg-yellow-100">
                            <PencilSquareIcon className="h-4 w-4"/>
                        </button>
                       </>
                    )}
                    <button onClick={() => handleDeleteBroadcast(b.id)} title="Delete" className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-red-100">
                        <TrashIcon className="h-4 w-4"/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BroadcastPage;
