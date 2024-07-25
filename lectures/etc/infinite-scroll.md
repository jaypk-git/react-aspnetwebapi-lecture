이 예제에서는 가상의 API에서 포스트 데이터를 가져오는 무한 스크롤 목록을 구현합니다.

먼저, 필요한 패키지를 설치합니다:

```bash
npm install react-query axios
```

그리고 다음과 같이 코드를 작성합니다:

```jsx
import React, { useRef, useCallback } from 'react';
import { useInfiniteQuery } from 'react-query';
import axios from 'axios';

const fetchPosts = async ({ pageParam = 1 }) => {
  const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=10`);
  return response.data;
};

function InfiniteScrollList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery('posts', fetchPosts, {
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < 10) return undefined;
      return pages.length + 1;
    },
  });

  const observer = useRef();
  const lastPostElementRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'error') return <div>Error fetching data</div>;

  return (
    <div>
      <h1>Infinite Scroll Posts</h1>
      {data.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.map((post, index) => (
            <div
              key={post.id}
              ref={page.length === index + 1 ? lastPostElementRef : null}
              style={{ border: '1px solid #ddd', margin: '10px', padding: '10px' }}
            >
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </div>
          ))}
        </React.Fragment>
      ))}
      {isFetchingNextPage && <div>Loading more...</div>}
    </div>
  );
}

export default InfiniteScrollList;
```

이 코드는 다음과 같이 작동합니다:

1. `useInfiniteQuery` 훅을 사용하여 포스트 데이터를 가져옵니다. 이 훅은 무한 스크롤에 필요한 여러 상태와 함수를 제공합니다.

2. `fetchPosts` 함수는 JSONPlaceholder API에서 페이지별로 10개의 포스트를 가져옵니다.

3. Intersection Observer를 사용하여 마지막 포스트 요소가 화면에 보이는지 감지합니다. 마지막 요소가 보이면 `fetchNextPage` 함수를 호출하여 다음 페이지의 데이터를 가져옵니다.

4. 각 포스트는 제목과 본문을 보여주는 간단한 카드 형태로 표시됩니다.

5. 데이터를 가져오는 동안 로딩 상태를 표시합니다.

이 컴포넌트를 사용하려면 React Query의 `QueryClientProvider`로 애플리케이션을 감싸야 합니다. 예를 들어:

```jsx
import { QueryClient, QueryClientProvider } from 'react-query';
import InfiniteScrollList from './InfiniteScrollList';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InfiniteScrollList />
    </QueryClientProvider>
  );
}

export default App;
```

이 예제는 스크롤을 내릴 때마다 새로운 포스트를 자동으로 로드하는 무한 스크롤 기능을 구현합니다. Intersection Observer API를 사용하여 마지막 요소의 가시성을 감지하고, React Query를 사용하여 데이터 페치와 캐싱을 관리합니다.
