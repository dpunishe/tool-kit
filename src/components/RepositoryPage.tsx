import { useState, useEffect } from 'react';
import { ApolloProvider, useQuery, gql } from '@apollo/client';
import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  headers: {
    Authorization: `Bearer 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`,
  },
});

const GET_REPOSITORIES = gql`
  query Repositories($searchTerm: String!, $perPage: Int!, $page: Int!) {
    search(query: $searchTerm, type: REPOSITORY, first: $perPage, after: $page) {
      repositoryCount
      edges {
        node {
          ... on Repository {
            id
            name
            description
            stargazers {
              totalCount
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

function GithubSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    async function fetchRepositories() {
      const { data } = await client.query({
        query: GET_REPOSITORIES,
        variables: {
          searchTerm: searchTerm,
          perPage: 10,
          page: (currentPage - 1) * 10,
        },
      });
        setRepositories(data.search.edges);
        setTotalPages(Math.ceil(data.search.repositoryCount / 10));
    }

    fetchRepositories();
  }, [searchTerm, currentPage]);

  function handleSearchTermChange(event) {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  }

  function handlePageChange(page) {
    setCurrentPage(page);
  }

  return (
    <ApolloProvider client={client}>
      <div>
        <div>
          <input type="text" value={searchTerm} onChange={handleSearchTermChange} />
        </div>
        <div>
          {repositories.map((edge) => (
            <div key={edge.node.id}>
              <h2>{edge.node.name}</h2>
              <p>{edge.node.description}</p>
              <p>Stars: {edge.node.stargazers.totalCount}</p>
            </div>
          ))}
        </div>
        <div>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(0, 10)
            .map((page) => (
              <button
                key={page}
                style={{ fontWeight: currentPage === page ? 'bold' : 'normal' }}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
        </div>
      </div>
    </ApolloProvider>
  );
}

export default GithubSearchPage;
