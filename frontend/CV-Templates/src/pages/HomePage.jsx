import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  Eye, 
  Star, 
  ArrowRight, 
  CheckCircle,
  Users,
  Award,
  Zap
} from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: FileText,
      title: 'Professional Templates',
      description: 'Choose from beautifully designed CV templates that make you stand out.'
    },
    {
      icon: Zap,
      title: 'Quick & Easy',
      description: 'Create your professional CV in minutes with our intuitive form builder.'
    },
    {
      icon: Eye,
      title: 'Live Preview',
      description: 'See your CV come to life with real-time preview as you type.'
    },
    {
      icon: Download,
      title: 'PDF Download',
      description: 'Download your CV as a high-quality PDF ready for any application.'
    }
  ];

  const stats = [
    { number: '95%', label: 'Success Rate' },
    { number: '24/7', label: 'Support' },
    { number: '4', label: 'Templates' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Build Your Dream Career with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 block">
                MYCVLAB
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Create professional, ATS-friendly CVs that get you noticed. Choose from premium templates, 
              customize with ease, and download instantly.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Create Your CV Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/preview"
                className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200"
              >
                <Eye className="mr-2 h-5 w-5" />
                View Templates
              </Link>
            </div>
            <div className="mt-6 text-center">
              <span className="text-gray-600">New to MYCVLAB? </span>
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Sign up for free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Why Choose MYCVLAB?
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              We make CV creation simple, fast, and professional
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 h-full">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Build Your Perfect CV?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Join thousands of professionals who have successfully landed their dream jobs with MYCVLAB
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Building Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;