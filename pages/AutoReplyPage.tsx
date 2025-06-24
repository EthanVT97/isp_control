
import React, { useState, useEffect, useCallback, useRef } from 'react';
import SectionTitle from '../components/SectionTitle';
import { QAItem } from '../types';
import { getGeminiResponse } from '../services/geminiService';
import ChatMessage from '../components/ChatMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { PlusCircleIcon, TrashIcon, PencilSquareIcon, PaperAirplaneIcon, SparklesIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';

interface ChatEntry {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

const AutoReplyPage: React.FC = () => {
  const { addLog } = useAppContext();
  const [qas, setQas] = useState<QAItem[]>([]);
  const [currentQA, setCurrentQA] = useState<Partial<QAItem>>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoadingResponse, setIsLoadingResponse] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentQA(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitQA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQA.question || !currentQA.answer) {
      alert('Question and Answer fields are required.');
      return;
    }
    if (isEditing && editingId) {
      setQas(prevQas => prevQas.map(qa => qa.id === editingId ? { ...currentQA, id: editingId } as QAItem : qa));
      addLog(`Q&A item updated: "${currentQA.question}"`, 'info');
    } else {
      const newQA = { ...currentQA, id: Date.now().toString() } as QAItem;
      setQas(prevQas => [...prevQas, newQA]);
      addLog(`New Q&A item added: "${newQA.question}"`, 'info');
    }
    setCurrentQA({});
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEditQA = (qa: QAItem) => {
    setCurrentQA(qa);
    setIsEditing(true);
    setEditingId(qa.id);
  };

  const handleDeleteQA = (id: string) => {
    const itemToDelete = qas.find(qa => qa.id === id);
    setQas(prevQas => prevQas.filter(qa => qa.id !== id));
    if(itemToDelete) addLog(`Q&A item deleted: "${itemToDelete.question}"`, 'info');
  };

  const handleSendMessage = useCallback(async () => {
    if (!userInput.trim()) return;

    const userMessage: ChatEntry = {
      id: Date.now().toString(),
      text: userInput,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    };
    setChatHistory(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoadingResponse(true);

    // Check Q&A first (simple exact match)
    const qaMatch = qas.find(qa => qa.question.toLowerCase() === userInput.toLowerCase());
    let botResponseText: string;

    if (qaMatch) {
      botResponseText = qaMatch.answer;
      addLog(`Auto-reply: Matched Q&A for "${userInput}"`, 'api');
    } else {
      // If no match, use Gemini
      addLog(`Auto-reply: Sending "${userInput}" to Gemini for Myanmar response.`, 'api');
      try {
        botResponseText = await getGeminiResponse(userInput, "Myanmar");
      } catch (error) {
        botResponseText = "တောင်းပန်ပါတယ်၊ အမှားတစ်ခုဖြစ်သွားပါတယ်။ ခဏနေမှ ပြန်ကြိုးစားပါ။ (Sorry, an error occurred. Please try again later.)";
        addLog(`Gemini API error: ${error instanceof Error ? error.message : String(error)}`, 'error');
      }
    }

    const botMessage: ChatEntry = {
      id: (Date.now() + 1).toString(),
      text: botResponseText,
      isUser: false,
      timestamp: new Date().toLocaleTimeString(),
    };
    setChatHistory(prev => [...prev, botMessage]);
    setIsLoadingResponse(false);
  }, [userInput, qas, addLog]);

  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [chatHistory]);
  
  useEffect(() => {
    addLog('Auto-Reply system loaded.', 'info');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div>
      <SectionTitle title="Auto-Reply System" subtitle="Manage Q&A database and test AI-powered responses in Myanmar." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Q&A Management Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <SparklesIcon className="h-6 w-6 mr-2 text-sky-500" /> Q&A Database
          </h3>
          <form onSubmit={handleSubmitQA} className="space-y-4 mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700">Question (User Input)</label>
              <input type="text" name="question" id="question" value={currentQA.question || ''} onChange={handleInputChange} placeholder="e.g., What are your opening hours?" className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500" />
            </div>
            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-gray-700">Answer (Bot Response in Myanmar)</label>
              <textarea name="answer" id="answer" value={currentQA.answer || ''} onChange={handleInputChange} rows={3} placeholder="e.g., ကျွန်ုပ်တို့၏ဖွင့်ချိန်မှာ မနက် ၉ နာရီမှ ညနေ ၅ နာရီအထိဖြစ်ပါသည်။" className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"></textarea>
            </div>
            <button type="submit" className="w-full flex items-center justify-center px-4 py-2 bg-sky-600 text-white font-semibold rounded-md shadow-md hover:bg-sky-700">
              <PlusCircleIcon className="h-5 w-5 mr-2" /> {isEditing ? 'Update Q&A' : 'Add Q&A'}
            </button>
            {isEditing && (
              <button type="button" onClick={() => { setIsEditing(false); setCurrentQA({}); setEditingId(null);}} className="w-full mt-2 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md shadow-md hover:bg-gray-300">
                Cancel Edit
              </button>
            )}
          </form>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {qas.length === 0 && <p className="text-sm text-gray-500">No Q&A items yet. Add some above!</p>}
            {qas.map(qa => (
              <div key={qa.id} className="p-3 border border-gray-200 rounded-md bg-white hover:shadow-md transition-shadow">
                <p className="font-medium text-gray-700">Q: {qa.question}</p>
                <p className="text-sm text-gray-600 mt-1">A: {qa.answer}</p>
                <div className="mt-2 text-right space-x-2">
                  <button onClick={() => handleEditQA(qa)} className="text-xs text-yellow-600 hover:text-yellow-800 p-1 rounded hover:bg-yellow-100">
                    <PencilSquareIcon className="h-4 w-4 inline-block"/> Edit
                  </button>
                  <button onClick={() => handleDeleteQA(qa.id)} className="text-xs text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100">
                    <TrashIcon className="h-4 w-4 inline-block"/> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Bot Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col h-[calc(100vh-12rem-4rem)]"> {/* Adjust height as needed */}
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <ChatBubbleLeftEllipsisIcon className="h-6 w-6 mr-2 text-sky-500" /> Test Bot (Myanmar Responses)
          </h3>
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md space-y-3">
            {chatHistory.map(chat => (
              <ChatMessage key={chat.id} text={chat.text} isUser={chat.isUser} timestamp={chat.timestamp} />
            ))}
            {isLoadingResponse && (
              <div className="flex justify-center py-2">
                <LoadingSpinner size="sm" text="AI က စဉ်းစားနေပါတယ်..." />
              </div>
            )}
             {chatHistory.length === 0 && !isLoadingResponse && (
                <p className="text-center text-gray-400 text-sm py-4">စကားပြောစတင်ရန် မက်ဆေ့ချ်ရိုက်ထည့်ပါ။ (Type a message to start the chat.)</p>
             )}
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoadingResponse && handleSendMessage()}
              placeholder="မက်ဆေ့ချ်တစ်ခု ရိုက်ထည့်ပါ... (Type a message...)"
              className="flex-1 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
              disabled={isLoadingResponse}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoadingResponse || !userInput.trim()}
              className="p-3 bg-sky-600 text-white rounded-md shadow-md hover:bg-sky-700 disabled:bg-gray-400 flex items-center justify-center"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
           <p className="text-xs text-gray-500 mt-2">
             Note: Bot first checks Q&A. If no match, Gemini API is used for a general response in Myanmar.
           </p>
        </div>
      </div>
    </div>
  );
};

export default AutoReplyPage;
