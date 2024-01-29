import { useTodos, useTodosIds } from '../services/queries';
import {
  useCreateTodo,
  useDeleteTodo,
  useUpdateTodo,
} from '../services/mutations';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Todo } from '../types/todo';

const Todos = () => {
  const todosIdsQuery = useTodosIds();
  const todosQueries = useTodos(todosIdsQuery.data);

  const createTodoMutation = useCreateTodo();
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

  const { register, handleSubmit } = useForm<Todo>();

  const handleCreateTodoSubmit: SubmitHandler<Todo> = (data) => {
    createTodoMutation.mutate(data);
  };

  const handleMarkAsDoneSubmit = (data: Todo | undefined) => {
    if (data) {
      updateTodoMutation.mutate({ ...data, checked: true });
    }
  };

  const handleDeleteTodo = async (id: number) => {
    // mutateAsync / mutate 차이점 구분.
    deleteTodoMutation.mutateAsync(id);
    console.log('success');
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleCreateTodoSubmit)}>
        <h4>New todo:</h4>
        <input placeholder='Title' {...register('title')} />
        <br />
        <input placeholder='Description' {...register('description')} />
        <input
          type='submit'
          disabled={createTodoMutation.isPending}
          value={createTodoMutation.isPending ? 'Creating...' : 'Create Todos'}
        />
      </form>
      {todosQueries.map(({ data }) => (
        <li key={data?.id}>
          <div>Id: {data?.id}</div>
          <span>
            <strong>Title:</strong> {data?.title}, {''}
            <strong>Description:</strong> {data?.description}
          </span>
          <div>
            <button onClick={() => handleMarkAsDoneSubmit(data)}>
              {data?.checked ? 'Done' : 'Mark as done'}
            </button>
            {data?.id && (
              <button onClick={() => handleDeleteTodo(data.id!)}>Delete</button>
            )}
          </div>
        </li>
      ))}
    </>
  );
};

export default Todos;
