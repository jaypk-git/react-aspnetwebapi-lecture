import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

import './App.css';
import ProductManagementForm from './ProductManagementForm';
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <ProductManagementForm />
    </QueryClientProvider>
  )
}

export default App;