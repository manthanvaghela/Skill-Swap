'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import TopNavigation from '../../components/TopNavigation';
import SwapRequestCard from '../../components/SwapRequestCard';

interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  color: string;
}

interface SwapRequest {
  id: string;
  user: {
    name: string;
    avatar: string;
    rating: number;
  };
  skillsOffered: Skill[];
  skillsWanted: Skill[];
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  message?: string;
}

export default function SwapsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'current'>('pending');
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock data - in real app, this would come from API
    const mockRequests: SwapRequest[] = [
      {
        id: '1',
        user: {
          name: 'Michael Chen',
          avatar: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20confident%20Asian%20man%20in%20his%20early%20thirties%20with%20short%20black%20hair%2C%20wearing%20a%20navy%20blue%20button-down%20shirt%2C%20smiling%20professionally%20at%20the%20camera%20in%20a%20modern%20office%20environment%20with%20clean%20background&width=48&height=48&seq=michael-profile&orientation=squarish',
          rating: 4.9
        },
        skillsOffered: [
          { name: 'Python', level: 'Expert', color: 'text-blue-700 bg-blue-100' },
          { name: 'Machine Learning', level: 'Advanced', color: 'text-green-700 bg-green-100' }
        ],
        skillsWanted: [
          { name: 'UI/UX Design', level: 'Intermediate', color: 'text-purple-700 bg-purple-100' },
          { name: 'Public Speaking', level: 'Beginner', color: 'text-orange-700 bg-orange-100' }
        ],
        status: 'pending',
        createdAt: '2 hours ago',
        message: 'Hi! I\'d love to help you with Python and ML concepts in exchange for some design guidance. I\'m working on a personal project that could use better UX.'
      },
      {
        id: '2',
        user: {
          name: 'Emma Laurent',
          avatar: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20friendly%20French%20woman%20with%20blonde%20hair%20pulled%20back%20in%20a%20neat%20bun%2C%20wearing%20a%20white%20blazer%2C%20smiling%20warmly%20at%20the%20camera%20in%20a%20bright%20modern%20office%20setting&width=48&height=48&seq=emma-profile&orientation=squarish',
          rating: 4.8
        },
        skillsOffered: [
          { name: 'French', level: 'Expert', color: 'text-pink-700 bg-pink-100' },
          { name: 'Translation', level: 'Expert', color: 'text-indigo-700 bg-indigo-100' }
        ],
        skillsWanted: [
          { name: 'Digital Marketing', level: 'Intermediate', color: 'text-red-700 bg-red-100' },
          { name: 'Photography', level: 'Beginner', color: 'text-yellow-700 bg-yellow-100' }
        ],
        status: 'pending',
        createdAt: '5 hours ago',
        message: 'Bonjour! I can help you become fluent in French. I\'m particularly interested in learning digital marketing strategies for my consulting business.'
      },
      {
        id: '3',
        user: {
          name: 'Sophia Wang',
          avatar: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20young%20Asian%20woman%20with%20long%20straight%20black%20hair%2C%20wearing%20a%20light%20gray%20sweater%2C%20smiling%20confidently%20at%20the%20camera%20in%20a%20contemporary%20workspace%20with%20natural%20lighting&width=48&height=48&seq=sophia-profile&orientation=squarish',
          rating: 4.7
        },
        skillsOffered: [
          { name: 'Digital Marketing', level: 'Expert', color: 'text-red-700 bg-red-100' },
          { name: 'Social Media', level: 'Advanced', color: 'text-teal-700 bg-teal-100' }
        ],
        skillsWanted: [
          { name: 'Web Development', level: 'Intermediate', color: 'text-blue-700 bg-blue-100' },
          { name: 'SEO', level: 'Advanced', color: 'text-green-700 bg-green-100' }
        ],
        status: 'accepted',
        createdAt: '1 day ago',
        message: 'Great to connect! I have 5+ years in digital marketing and would love to learn more about modern web development practices.'
      },
      {
        id: '4',
        user: {
          name: 'James Rodriguez',
          avatar: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20Hispanic%20man%20in%20his%20late%20twenties%20with%20short%20dark%20hair%20and%20a%20beard%2C%20wearing%20a%20black%20polo%20shirt%2C%20smiling%20professionally%20at%20the%20camera%20in%20a%20modern%20office%20environment&width=48&height=48&seq=james-profile&orientation=squarish',
          rating: 4.6
        },
        skillsOffered: [
          { name: 'Guitar', level: 'Expert', color: 'text-purple-700 bg-purple-100' },
          { name: 'Music Theory', level: 'Advanced', color: 'text-indigo-700 bg-indigo-100' }
        ],
        skillsWanted: [
          { name: 'Video Editing', level: 'Intermediate', color: 'text-red-700 bg-red-100' },
          { name: 'Content Creation', level: 'Beginner', color: 'text-orange-700 bg-orange-100' }
        ],
        status: 'accepted',
        createdAt: '2 days ago'
      },
      {
        id: '5',
        user: {
          name: 'Lisa Thompson',
          avatar: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20Caucasian%20woman%20with%20curly%20red%20hair%2C%20wearing%20a%20green%20blouse%2C%20smiling%20warmly%20at%20the%20camera%20in%20a%20bright%20office%20setting%20with%20plants%20in%20the%20background&width=48&height=48&seq=lisa-profile&orientation=squarish',
          rating: 4.5
        },
        skillsOffered: [
          { name: 'Cooking', level: 'Expert', color: 'text-orange-700 bg-orange-100' },
          { name: 'Nutrition', level: 'Advanced', color: 'text-green-700 bg-green-100' }
        ],
        skillsWanted: [
          { name: 'Yoga', level: 'Beginner', color: 'text-pink-700 bg-pink-100' },
          { name: 'Meditation', level: 'Beginner', color: 'text-purple-700 bg-purple-100' }
        ],
        status: 'rejected',
        createdAt: '3 days ago'
      }
    ];
    
    setSwapRequests(mockRequests);
  }, []);

  const handleAccept = (id: string) => {
    setLoading(true);
    setTimeout(() => {
      setSwapRequests(prev => 
        prev.map(request => 
          request.id === id ? { ...request, status: 'accepted' as const } : request
        )
      );
      setLoading(false);
    }, 500);
  };

  const handleReject = (id: string) => {
    setLoading(true);
    setTimeout(() => {
      setSwapRequests(prev => 
        prev.map(request => 
          request.id === id ? { ...request, status: 'rejected' as const } : request
        )
      );
      setLoading(false);
    }, 500);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this swap request?')) {
      setSwapRequests(prev => prev.filter(request => request.id !== id));
    }
  };

  const pendingRequests = swapRequests.filter(request => request.status === 'pending');
  const currentRequests = swapRequests.filter(request => request.status !== 'pending');

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <TopNavigation />
      
      <main className="ml-64 pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Swaps</h1>
                <p className="text-gray-600 mt-1">Manage your skill exchange requests and connections</p>
              </div>
              
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-2">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-search-line"></i>
                </div>
                <span>Browse Skills</span>
              </button>
            </div>

            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'pending'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pending Requests ({pendingRequests.length})
              </button>
              <button
                onClick={() => setActiveTab('current')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'current'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Current Swaps ({currentRequests.length})
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {activeTab === 'pending' && (
              <>
                {pendingRequests.length === 0 ? (
                  <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                    <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 bg-gray-100 rounded-full">
                      <i className="ri-exchange-line text-2xl text-gray-400"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Requests</h3>
                    <p className="text-gray-500 mb-6">You don't have any pending swap requests at the moment.</p>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap">
                      Browse Available Skills
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Pending Requests ({pendingRequests.length})
                      </h2>
                      <div className="text-sm text-gray-500">
                        New requests appear here for your review
                      </div>
                    </div>
                    
                    <div className="grid gap-6">
                      {pendingRequests.map((request) => (
                        <SwapRequestCard
                          key={request.id}
                          request={request}
                          onAccept={handleAccept}
                          onReject={handleReject}
                          onDelete={handleDelete}
                          showActions={true}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            {activeTab === 'current' && (
              <>
                {currentRequests.length === 0 ? (
                  <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                    <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 bg-gray-100 rounded-full">
                      <i className="ri-team-line text-2xl text-gray-400"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Swaps</h3>
                    <p className="text-gray-500 mb-6">Start connecting with other users to see your active swaps here.</p>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap">
                      Find Skill Partners
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Current Swaps ({currentRequests.length})
                      </h2>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-500">
                          {currentRequests.filter(r => r.status === 'accepted').length} Active • {currentRequests.filter(r => r.status === 'rejected').length} Declined
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid gap-6">
                      {currentRequests.map((request) => (
                        <SwapRequestCard
                          key={request.id}
                          request={request}
                          onDelete={handleDelete}
                          showActions={false}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-loader-line animate-spin"></i>
                </div>
                <span className="text-gray-700">Processing...</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}