import React, { useState, useEffect } from 'react';

const BrowseUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchKeywords, setSearchKeywords] = useState('');
  const [searchType, setSearchType] = useState('both');
  const [sortBy, setSortBy] = useState('name');
  const [apiUrl] = useState('http://localhost:5013');

  // Load all users on component mount
  useEffect(() => {
    loadUsers();
  }, [sortBy]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/browse-users?sort_by=${sortBy}`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    if (!searchKeywords.trim()) {
      loadUsers();
      return;
    }

    setLoading(true);
    try {
      const keywords = searchKeywords.split(',').map(kw => kw.trim()).filter(kw => kw);
      
      const response = await fetch(`${apiUrl}/api/search-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keywords: keywords,
          search_type: searchType
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchUsers();
  };

  const handleQuickSearch = (term) => {
    setSearchTerm(term);
    setSearchKeywords(term);
    searchUsers();
  };

  const getSkillBadgeClass = (skill, matchedSkills) => {
    if (matchedSkills && matchedSkills.includes(skill)) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getWantedSkillBadgeClass = (skill, matchedWanted) => {
    if (matchedWanted && matchedWanted.includes(skill)) {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Users</h1>
            <p className="text-gray-600">Find users with skills you need or who want to learn your skills</p>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Keyword Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Keywords
                </label>
                <input
                  type="text"
                  value={searchKeywords}
                  onChange={(e) => setSearchKeywords(e.target.value)}
                  placeholder="e.g., JavaScript, Python, React"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple keywords with commas</p>
              </div>

              {/* Search Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search In
                </label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="both">Skills & Wanted Skills</option>
                  <option value="skills">Skills Only</option>
                  <option value="wanted">Wanted Skills Only</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Name</option>
                  <option value="skills_count">Most Skills</option>
                  <option value="match_score">Relevance</option>
                </select>
              </div>
            </div>

            {/* Search Buttons */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {loading ? 'Searching...' : 'Search Users'}
              </button>
              <button
                onClick={loadUsers}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Show All Users
              </button>
            </div>

            {/* Quick Search Tags */}
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Quick search:</p>
              <div className="flex flex-wrap gap-2">
                {['JavaScript', 'Python', 'React', 'Machine Learning', 'Node.js', 'Data Science'].map((term) => (
                  <button
                    key={term}
                    onClick={() => handleQuickSearch(term)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {loading ? 'Loading...' : `${users.length} Users Found`}
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Searching users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600">No users found. Try adjusting your search criteria.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {users.map((user) => (
                  <div key={user.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {user.name}
                          {user.relevance_percentage && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {user.relevance_percentage}% match
                            </span>
                          )}
                        </h3>
                        
                        {/* Skills Section */}
                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Skills ({user.skills_count})</h4>
                          <div className="flex flex-wrap gap-2">
                            {user.skills.map((skill) => (
                              <span
                                key={skill}
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSkillBadgeClass(skill, user.matched_skills)}`}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Wanted Skills Section */}
                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Wants to Learn ({user.wanted_count})</h4>
                          <div className="flex flex-wrap gap-2">
                            {user.skillsWanted.map((skill) => (
                              <span
                                key={skill}
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getWantedSkillBadgeClass(skill, user.matched_wanted)}`}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Match Details */}
                        {user.matched_skills && user.matched_skills.length > 0 && (
                          <div className="text-sm text-green-600">
                            <strong>Matched skills:</strong> {user.matched_skills.join(', ')}
                          </div>
                        )}
                        {user.matched_wanted && user.matched_wanted.length > 0 && (
                          <div className="text-sm text-orange-600">
                            <strong>Matched wanted skills:</strong> {user.matched_wanted.join(', ')}
                          </div>
                        )}
                      </div>

                      <div className="ml-4 flex flex-col items-end">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                          Connect
                        </button>
                        <button className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm">
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseUsers; 
