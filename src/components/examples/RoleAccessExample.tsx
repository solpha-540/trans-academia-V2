import React from 'react';
import useRoleAccess from '../../hooks/useRoleAccess';
import { ACCESS_CONFIGS } from '../../config/accessConfig';

const RoleAccessExample: React.FC = () => {
  // Example 1: Using with predefined config
  const { hasAccess: hasFeatureAccess, userRole } = useRoleAccess(ACCESS_CONFIGS.FEATURES);
  
  // Example 2: Using with custom config
  const customConfig = {
    'special-feature': ['Chef personnel'],
    'basic-feature': ['Agent', 'Chef personnel']
  };
  const { hasAccess: hasCustomAccess } = useRoleAccess(customConfig);
  
  // Example 3: Using without default config (pass config each time)
  const { hasAccess: hasPageAccess, checkMultipleAccess } = useRoleAccess();
  
  // Check multiple resources at once
  const navigationAccess = checkMultipleAccess(
    ['dashboard', 'personnel-management', 'reports'], 
    ACCESS_CONFIGS.NAVIGATION
  );

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Role Access Examples</h2>
      <p className="text-gray-600">Current user role: <span className="font-semibold">{userRole || 'No role'}</span></p>
      
      {/* Feature Access Example */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3">Feature Access</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {hasFeatureAccess('create-user') ? (
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Create User</button>
            ) : (
              <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded cursor-not-allowed" disabled>
                Create User (No Access)
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {hasFeatureAccess('view-profile') ? (
              <button className="bg-green-500 text-white px-4 py-2 rounded">View Profile</button>
            ) : (
              <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded cursor-not-allowed" disabled>
                View Profile (No Access)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Custom Config Example */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3">Custom Configuration</h3>
        <div className="space-y-2">
          {hasCustomAccess('special-feature') && (
            <div className="bg-yellow-100 p-3 rounded border-l-4 border-yellow-500">
              🌟 Special Feature Available!
            </div>
          )}
          
          {hasCustomAccess('basic-feature') && (
            <div className="bg-blue-100 p-3 rounded border-l-4 border-blue-500">
              ✅ Basic Feature Available!
            </div>
          )}
        </div>
      </div>

      {/* Navigation Access Example */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3">Navigation Access</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(navigationAccess).map(([page, hasAccess]) => (
            <span
              key={page}
              className={`px-3 py-1 rounded-full text-sm ${
                hasAccess 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {page}: {hasAccess ? '✅' : '❌'}
            </span>
          ))}
        </div>
      </div>

      {/* Page Access Example */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3">Page Access</h3>
        <div className="space-y-2">
          {hasPageAccess('admin-panel', ACCESS_CONFIGS.PAGES) ? (
            <div className="text-green-600">✅ Can access Admin Panel</div>
          ) : (
            <div className="text-red-600">❌ Cannot access Admin Panel</div>
          )}
          
          {hasPageAccess('dashboard', ACCESS_CONFIGS.PAGES) ? (
            <div className="text-green-600">✅ Can access Dashboard</div>
          ) : (
            <div className="text-red-600">❌ Cannot access Dashboard</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleAccessExample;
