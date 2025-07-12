'use client';

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

interface SwapRequestCardProps {
  request: SwapRequest;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export default function SwapRequestCard({ 
  request, 
  onAccept, 
  onReject, 
  onDelete, 
  showActions = true 
}: SwapRequestCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-700 bg-yellow-100';
      case 'accepted': return 'text-green-700 bg-green-100';
      case 'rejected': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return 'ri-time-line';
      case 'accepted': return 'ri-check-line';
      case 'rejected': return 'ri-close-line';
      default: return 'ri-question-line';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <img
            src={request.user.avatar}
            alt={request.user.name}
            className="w-12 h-12 rounded-full object-cover object-top"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{request.user.name}</h3>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-star-fill text-yellow-400 text-sm"></i>
              </div>
              <span className="text-sm text-gray-600">{request.user.rating}</span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-500">{request.createdAt}</span>
            </div>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(request.status)}`}>
          <div className="w-3 h-3 flex items-center justify-center">
            <i className={getStatusIcon(request.status)}></i>
          </div>
          <span className="capitalize">{request.status}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <div className="w-4 h-4 flex items-center justify-center mr-2">
              <i className="ri-gift-line text-green-600"></i>
            </div>
            Skills Offered
          </h4>
          <div className="flex flex-wrap gap-2">
            {request.skillsOffered.map((skill, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-xs font-medium ${skill.color}`}
              >
                {skill.name} ({skill.level})
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <div className="w-4 h-4 flex items-center justify-center mr-2">
              <i className="ri-search-line text-blue-600"></i>
            </div>
            Skills Wanted
          </h4>
          <div className="flex flex-wrap gap-2">
            {request.skillsWanted.map((skill, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-xs font-medium ${skill.color}`}
              >
                {skill.name} ({skill.level})
              </span>
            ))}
          </div>
        </div>
      </div>

      {request.message && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">{request.message}</p>
        </div>
      )}

      {showActions && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer whitespace-nowrap">
            View Profile
          </button>
          
          <div className="flex items-center space-x-3">
            {request.status === 'pending' && (
              <>
                <button
                  onClick={() => onReject?.(request.id)}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  Reject
                </button>
                <button
                  onClick={() => onAccept?.(request.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  Accept
                </button>
              </>
            )}
            
            <button
              onClick={() => onDelete?.(request.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-delete-bin-line"></i>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}