import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, PieChart, Target, Bell, RefreshCw, Zap, DollarSign } from 'lucide-react';

export default function LandingPage() {
  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: BarChart3,
      title: 'Track Personal Expenses',
      description: 'Easily log and categorize your daily spending with our intuitive interface.',
    },
    {
      icon: PieChart,
      title: 'Visual Analytics',
      description: 'Get insights into your spending patterns with beautiful charts and graphs.',
    },
    {
      icon: Target,
      title: 'Monthly Budgets',
      description: 'Set and track monthly budgets to stay on top of your financial goals.',
    },
    {
      icon: Bell,
      title: 'Reminders & Alerts',
      description: 'Never miss a payment or budget deadline with smart notifications.',
    },
    {
      icon: RefreshCw,
      title: 'Recurring Expenses',
      description: 'Automatically track subscriptions and recurring monthly expenses.',
    },
    {
      icon: Zap,
      title: 'Real-Time Sync',
      description: 'Your data is always up-to-date across all your devices.',
    },
  ];

  const steps = [
    {
      step: '1',
      title: 'Add Your Expenses',
      description: 'Quickly log your daily expenses with just a few taps. Categorize and tag them for better organization.',
    },
    {
      step: '2',
      title: 'Review Your Spending',
      description: 'View detailed analytics and insights about your spending patterns. Identify areas for improvement.',
    },
    {
      step: '3',
      title: 'Plan & Optimize',
      description: 'Set budgets, track progress, and make informed decisions to improve your financial health.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">ExpenseTrace</span>
            </div>
            <nav className="flex space-x-6">
              <Link
                to="/signin"
                className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Take control of your finances
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Your personal expense tracker to master your money
            </p>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Easily track your spending, visualize trends, and manage your budget—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-indigo-600 text-white px-8 py-3 rounded-md hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button
                onClick={scrollToHowItWorks}
                className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-md hover:bg-indigo-50 transition-colors font-medium"
              >
                See How It Works
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to track your expenses
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive tools to help you manage your finances effectively
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="bg-indigo-100 rounded-lg p-3 w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stay on top of your personal finances in 3 easy steps
            </h2>
            <p className="text-lg text-gray-600">
              Simple, effective approach to expense tracking
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start using ExpenseTrace to build smarter money habits today.
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of users who have taken control of their finances
          </p>
          <Link
            to="/signup"
            className="bg-white text-indigo-600 px-8 py-3 rounded-md hover:bg-gray-100 transition-colors font-medium inline-flex items-center"
          >
            Start Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-6 w-6 text-indigo-400" />
              <span className="text-xl font-bold">ExpenseTrace</span>
            </div>
            <p className="text-gray-400">
              © 2025 ExpenseTrace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}