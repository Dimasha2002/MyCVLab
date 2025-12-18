import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  User, 
  Eye, 
  Download, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Plus,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useCV } from '../hooks/useCV';
import { LoadingCard } from '../components/Loading';
import { Alert } from '../components/Alert';

const DashboardPage = () => {
  const { user } = useAuth();
  const { profile, completion, loading: profileLoading } = useProfile();
  const { history, loadHistory, loading: historyLoading } = useCV();

  useEffect(() => {
    loadHistory(1, 5); // Load recent history
  }, []);

  const quickActions = [
    {
      title: 'Create/Edit CV',
      description: 'Fill in your professional details',
      icon: FileText,
      href: '/cv-form',
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Preview Templates',
      description: 'See how your CV looks',
      icon: Eye,
      href: '/preview',
      color: 'bg-green-500',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: 'View History',
      description: 'Access your generated CVs',
      icon: Clock,
      href: '/history',
      color: 'bg-purple-500',
      textColor: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
  ];

  const stats = [
    {
      name: 'Profile Completion',
      value: `${completion}%`,
      icon: CheckCircle,
      color: completion >= 100 ? 'text-green-600' : 'text-yellow-600',
      bgColor: completion >= 100 ? 'bg-green-100' : 'bg-yellow-100',
    },
    {
      name: 'CVs Generated',
      value: history.length || '0',
      icon: Download,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Templates Available',
      value: '3',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getNextStep = () => {
    if (!profile) {
      return {
        title: 'Complete your profile',
        description: 'Start by filling in your professional details to create your first CV.',
        action: 'Get Started',
        href: '/cv-form',
      };
    }
    
    if (completion < 80) {
      return {
        title: 'Improve your profile',
        description: 'Add more details to make your CV stand out to employers.',
        action: 'Complete Profile',
        href: '/cv-form',
      };
    }
    
    if (history.length === 0) {
      return {
        title: 'Generate your first CV',
        description: 'Your profile looks great! Preview and download your CV.',
        action: 'Preview & Download',
        href: '/preview',
      };
    }
    
    return {
      title: 'Keep your CV updated',
      description: 'Regular updates ensure your CV reflects your latest achievements.',
      action: 'Update Profile',
      href: '/cv-form',
    };
  };

  const nextStep = getNextStep();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Welcome to your CVTrio dashboard. Let's create something amazing.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-md ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Next Step Card */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{nextStep.title}</h3>
                <p className="text-primary-100 mb-4">{nextStep.description}</p>
                <Link
                  to={nextStep.href}
                  className="inline-flex items-center bg-white text-primary-600 px-4 py-2 rounded-md font-medium hover:bg-primary-50 transition-colors"
                >
                  {nextStep.action}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
              <div className="hidden lg:block">
                <FileText className="h-24 w-24 text-primary-200" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-4">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  to={action.href}
                  className={`block p-4 rounded-lg border-2 ${action.borderColor} ${action.bgColor} hover:shadow-md transition-all duration-200 group`}
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-md ${action.color}`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className={`font-medium ${action.textColor}`}>
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                    <ArrowRight className={`h-5 w-5 ${action.textColor} group-hover:translate-x-1 transition-transform`} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <Link
                to="/history"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View all
              </Link>
            </div>

            {historyLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <LoadingCard key={i} />
                ))}
              </div>
            ) : history.length > 0 ? (
              <div className="space-y-3">
                {history.slice(0, 5).map((item) => (
                  <div key={item._id} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-primary-100 p-2 rounded-md">
                          <FileText className="h-4 w-4 text-primary-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {item.templateName}
                          </p>
                          <p className="text-xs text-gray-500">
                            Generated {new Date(item.generatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        Downloaded {item.downloadCount || 0} times
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  No CVs generated yet
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Start by completing your profile and generating your first CV.
                </p>
                <Link
                  to="/cv-form"
                  className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Profile Completion Alert */}
        {profile && completion < 100 && (
          <div className="mt-8">
            <Alert type="warning" title="Complete your profile">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-2">
                    Your profile is {completion}% complete. Add more information to make your CV stand out.
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${completion}%` }}
                    ></div>
                  </div>
                </div>
                <Link
                  to="/cv-form"
                  className="ml-4 btn-outline whitespace-nowrap"
                >
                  Complete Now
                </Link>
              </div>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;