import { QueryClient, QueryClientProvider } from 'react-query';
import InfiniteScrollList from './InfiniteScollList';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <InfiniteScrollList />
        </QueryClientProvider>
    );
}

export default App;