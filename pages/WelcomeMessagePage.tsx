
import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import RichMediaPreview from '../components/RichMediaPreview';
import { WelcomeMessageConfig, RichMediaButton } from '../types';
import { MYANMAR_WELCOME_TITLE, MYANMAR_WELCOME_TEXT, MYANMAR_BUTTON_FEATURES, MYANMAR_BUTTON_COMMANDS, MYANMAR_BUTTON_SERVICES, MYANMAR_BUTTON_HELP, DEFAULT_BOT_IMAGE_URL } from '../constants';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';

const WelcomeMessagePage: React.FC = () => {
  const { addLog } = useAppContext();
  const [config, setConfig] = useState<WelcomeMessageConfig>({
    title: MYANMAR_WELCOME_TITLE,
    text: MYANMAR_WELCOME_TEXT,
    imageUrl: DEFAULT_BOT_IMAGE_URL,
    buttons: [
      { id: 'btn1', text: MYANMAR_BUTTON_FEATURES, actionType: 'reply', actionBody: 'show_features' },
      { id: 'btn2', text: MYANMAR_BUTTON_COMMANDS, actionType: 'reply', actionBody: 'list_commands' },
      { id: 'btn3', text: MYANMAR_BUTTON_SERVICES, actionType: 'open-url', actionBody: 'https://example.com/services' },
      { id: 'btn4', text: MYANMAR_BUTTON_HELP, actionType: 'reply', actionBody: 'help_me' },
    ],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleButtonChange = (index: number, field: keyof RichMediaButton, value: string) => {
    setConfig(prev => {
      const newButtons = [...prev.buttons];
      // Type assertion needed because field can be 'id', 'text', 'actionType', 'actionBody'
      (newButtons[index] as any)[field] = value;
      return { ...prev, buttons: newButtons };
    });
  };
  
  const addDefaultButton = () => {
    setConfig(prev => ({
        ...prev,
        buttons: [
            ...prev.buttons,
            { id: `btn${Date.now()}`, text: 'New Button', actionType: 'reply', actionBody: 'new_action' }
        ]
    }));
  };

  const removeButton = (index: number) => {
    setConfig(prev => ({
        ...prev,
        buttons: prev.buttons.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    // In a real app, this would send data to a backend
    console.log('Saving welcome message config:', config);
    addLog('Welcome message configuration saved (simulated).', 'info');
    alert('Welcome message configuration saved (simulated)! Check console and activity log.');
  };

  useEffect(() => {
    addLog('Welcome Message editor loaded.', 'info');
  }, [addLog]);

  return (
    <div>
      <SectionTitle title="Welcome Message Configuration" subtitle="Design the rich media message for new users (Myanmar Language Focused)." />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Message Content</h3>
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title (Myanmar)</label>
              <input type="text" name="title" id="title" value={config.title} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500" />
            </div>
            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">Text Body (Myanmar)</label>
              <textarea name="text" id="text" value={config.text} onChange={handleInputChange} rows={4} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"></textarea>
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input type="text" name="imageUrl" id="imageUrl" value={config.imageUrl} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500" />
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Interactive Buttons (Max 6 for typical Viber Rich Media)</h3>
          {config.buttons.map((button, index) => (
            <div key={button.id || index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center mb-4 p-3 border border-gray-200 rounded-md">
              <div className="md:col-span-3">
                <label htmlFor={`btn-text-${index}`} className="block text-xs font-medium text-gray-600">Text</label>
                <input type="text" id={`btn-text-${index}`} value={button.text} onChange={(e) => handleButtonChange(index, 'text', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm text-sm" />
              </div>
              <div className="md:col-span-3">
                <label htmlFor={`btn-action-${index}`} className="block text-xs font-medium text-gray-600">Action Type</label>
                <select id={`btn-action-${index}`} value={button.actionType} onChange={(e) => handleButtonChange(index, 'actionType', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm text-sm">
                  <option value="reply">Reply to Bot</option>
                  <option value="open-url">Open URL</option>
                </select>
              </div>
              <div className="md:col-span-5">
                <label htmlFor={`btn-body-${index}`} className="block text-xs font-medium text-gray-600">Action Body (e.g., URL or reply keyword)</label>
                <input type="text" id={`btn-body-${index}`} value={button.actionBody} onChange={(e) => handleButtonChange(index, 'actionBody', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm text-sm" />
              </div>
              <div className="md:col-span-1 flex items-end">
                 <button onClick={() => removeButton(index)} className="p-2 text-red-500 hover:text-red-700">
                    <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
          {config.buttons.length < 6 && (
            <button onClick={addDefaultButton} className="mt-2 flex items-center text-sm text-sky-600 hover:text-sky-800 font-medium py-2 px-3 border border-sky-500 rounded-md hover:bg-sky-50">
                <PlusCircleIcon className="h-5 w-5 mr-2" /> Add Button
            </button>
          )}
          
          <div className="mt-10 text-right">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-sky-600 text-white font-semibold rounded-md shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
            >
              Save Welcome Message
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Live Preview</h3>
          <RichMediaPreview config={config} />
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessagePage;
