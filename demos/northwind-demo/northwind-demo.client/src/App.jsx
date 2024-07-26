import { QueryClient, QueryClientProvider } from 'react-query'

import './App.css';
import EmployeeManagementForm from './EmployeeManagementForm';
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <EmployeeManagementForm />
    </QueryClientProvider>
  )
}

export default App;