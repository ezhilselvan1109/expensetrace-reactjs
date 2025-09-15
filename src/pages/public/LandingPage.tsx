import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Wallet, PieChart } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full">
        <div className="flex w-full px-4 py-3 sm:px-6 sm:py-4 items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="../logo.png"
              alt="ExpenseTrace Logo"
              className="h-7 sm:h-9 lg:h-12 w-auto"
            />
          </Link>

          {/* Sign In */}
          <Link
            to="/log-in-or-create-account"
            className="px-3 py-1.5 sm:px-5 sm:py-2 border border-gray-300 rounded-full text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-10 sm:pt-20 lg:pt-28 pb-10 sm:pb-20 lg:pb-24">
          <div className="max-w-3xl mx-auto px-5 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-8 leading-snug">
              Take Control of Your{" "}
              <span className="text-blue-600">Expenses</span> &{" "}
              <span className="text-blue-600">Savings</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-8 sm:mb-12 leading-relaxed">
              Track your income and expenses effortlessly. Get insights that
              help you save more and spend smarter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <Link
                to="/log-in-or-create-account"
                className="px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 text-white rounded-full text-base sm:text-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight size={18} className="sm:w-5 sm:h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="how-it-works" className="py-12 sm:py-20 lg:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-10 sm:mb-16">
              How ExpenseTrace Works
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10">
              <div className="p-6 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col items-center text-center">
                <Wallet className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold mb-3">
                  Track Transactions
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Log your income and expenses with ease. Stay on top of where
                  your money goes.
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col items-center text-center">
                <BarChart3 className="w-10 h-10 text-green-600 mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold mb-3">
                  Get Insights
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Visualize your spending patterns and identify opportunities to
                  save more.
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col items-center text-center">
                <PieChart className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold mb-3">
                  Budget Smarter
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Create budgets and stick to them. Achieve your financial goals
                  faster.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="py-14 sm:py-24 lg:py-32 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-center">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-5">
              Start Managing Your Finances Today
            </h2>
            <p className="text-base sm:text-lg lg:text-xl mb-8 sm:mb-12 leading-relaxed">
              Simplify the way you manage money. Track expenses, set budgets,
              and achieve your financial goals with ease.
            </p>
            <Link
              to="/log-in-or-create-account"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-full text-base sm:text-lg font-semibold hover:bg-gray-100 transition"
            >
              Create Free Account
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-5 py-8 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
          <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
            © {new Date().getFullYear()} ExpenseTrace. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base">
            <Link to="/about" className="hover:text-white">
              About
            </Link>
            <Link to="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}