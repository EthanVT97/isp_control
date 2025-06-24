
import React from 'react';
import { WelcomeMessageConfig, RichMediaButton } from '../types';

interface RichMediaPreviewProps {
  config: WelcomeMessageConfig;
}

const RichMediaPreview: React.FC<RichMediaPreviewProps> = ({ config }) => {
  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
      {config.imageUrl && (
        <img src={config.imageUrl} alt="Welcome Media" className="w-full h-48 object-cover" />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{config.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{config.text}</p>
      </div>
      {config.buttons.length > 0 && (
        <div className="grid grid-cols-1 gap-px bg-gray-200">
          {config.buttons.map((button, index) => (
            <button
              key={button.id || index}
              className="bg-white p-3 text-center text-sm text-sky-600 hover:bg-gray-50 transition-colors"
              title={`Action: ${button.actionType} - ${button.actionBody}`}
            >
              {button.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RichMediaPreview;
