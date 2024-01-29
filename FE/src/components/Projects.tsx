import { useState } from 'react';
import { useProjects } from '../services/queries';

const Projects = () => {
  const [page, setPage] = useState(1);

  const { data, isPending, error, isError, isPlaceholderData, isFetching } =
    useProjects(page);
  return (
    <>
      <div>
        {isPending ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error: {error.message}</div>
        ) : (
          <div>
            {data.map((project) => (
              <p key={project.id}>{project.name}</p>
            ))}
          </div>
        )}
      </div>
      <span>Current Page: {page}</span>
      <button onClick={() => setPage((old) => Math.max(old - 1, 0))}>
        Previous Page
      </button>
      <button
        onClick={() => {
          if (!isPlaceholderData) {
            setPage((old) => old + 1);
          }
        }}
        disabled={isPlaceholderData}
      >
        Next Page
      </button>
      {isFetching ? <span>Loading ...</span> : null}
    </>
  );
};

// Exporting the Projects component as the default export
export default Projects;
