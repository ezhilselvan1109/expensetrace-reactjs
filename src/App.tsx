import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import PrivateLayout from './components/Layout/PrivateLayout';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import PlaceholderPage from './pages/placeholder/PlaceholderPage';
import Categories from './pages/Categories';
import CategoryForm from './pages/CategoryForm';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          } />
          <Route path="/signin" element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          } />
          <Route path="/forgotpassword" element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <PrivateLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="analysis" element={<Analysis />} />
            <Route path="accounts" element={
              <PlaceholderPage 
                title="Accounts" 
                description="Manage your bank accounts and credit cards" 
              />
            } />
            <Route path="transactions" element={
              <PlaceholderPage 
                title="Transactions" 
                description="View and manage all your transactions" 
              />
            } />
            <Route path="tags" element={
              <PlaceholderPage 
                title="Tags" 
                description="Organize your expenses with custom tags" 
              />
            } />
            <Route path="budgets" element={
              <PlaceholderPage 
                title="Budgets" 
                description="Set and track your monthly budgets" 
              />
            } />
            <Route path="categories" element={
              <Categories />
            } />
            <Route path="categories/add" element={<CategoryForm />} />
            <Route path="categories/edit/:id" element={<CategoryForm />} />
            <Route path="scheduled" element={
              <PlaceholderPage 
                title="Scheduled Transactions" 
                description="Set up recurring income and expenses" 
              />
            } />
            <Route path="debts" element={
              <PlaceholderPage 
                title="Debts" 
                description="Track and manage your debts" 
              />
            } />
            <Route path="views" element={
              <PlaceholderPage 
                title="Views" 
                description="Create custom views of your financial data" 
              />
            } />
            <Route path="settings" element={
              <PlaceholderPage 
                title="Settings" 
                description="Manage your account settings and preferences" 
              />
            } />
            <Route path="about" element={
              <PlaceholderPage 
                title="About" 
                description="Learn more about ExpenseTrace" 
              />
            } />
          </Route>

          {/* Redirect to dashboard for authenticated users */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;