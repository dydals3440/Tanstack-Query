import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Todo } from '../types/todo';
import { createTodo, deleteTodo, updateTodo } from './api';

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Todo) => createTodo(data),
    //onMutate 는 mutation 함수가 실행되기 전에 실행되고 mutation 함수가 받을 동일한 변수가 전달된다. optimistic update 사용시 유용
    onMutate: () => {
      // 이건 mutationFn createTodo 실행 이전에 실행됨
      console.log('mutate');
    },
    onError: () => {
      console.log('error here');
    },
    onSuccess: () => {
      console.log('success');
    },
    // error state, success state this unsettled will always run dend of your mutation
    // 즉, 성공하든 실패하든 결과가 전달된다.
    // variables는 mutationFn에서 선언한 data(Todo타입 담고있음)
    onSettled: async (_, error) => {
      console.log('settled');
      // 이렇게 invalidateQueries를 통해 queryKey를 업데이트해줘야, 업데이트를 해도 화면이 자동으로 렌더링된다.
      if (error) {
        console.log(error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ['todos'] });
      }
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Todo) => updateTodo(data),
    onSettled: async (_, error, variables) => {
      if (error) {
        console.log(error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ['todos'] });
        await queryClient.invalidateQueries({
          queryKey: ['todo', { id: variables.id }],
        });
      }
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTodo(id),

    onSuccess: () => {
      console.log('deleted successfully');
    },

    onSettled: async (_, error) => {
      if (error) {
        console.log(error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ['todos'] });
      }
    },
  });
}
