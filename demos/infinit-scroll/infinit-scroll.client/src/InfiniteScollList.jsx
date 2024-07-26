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