import {
  keepPreviousData,
  useInfiniteQuery,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getProduct,
  getProducts,
  getProjects,
  getTodo,
  getTodosIds,
} from './api';
import { Product } from '../types/product';

export function useTodosIds() {
  return useQuery({
    queryKey: ['todos'],
    // queryFn은 항상 Promise를 리턴해야함.
    queryFn: getTodosIds,
    refetchOnWindowFocus: false,
  });
}

export function useTodos(ids: (number | undefined)[] | undefined) {
  // multiple queries donot know howmany
  return useQueries({
    queries: (ids ?? []).map((id) => {
      return {
        queryKey: ['todo', { id }],
        // id가 항상 정의됨을 !로 명시
        queryFn: () => getTodo(id!),
      };
    }),
  });
}

// PROJECTS

export function useProjects(page: number) {
  return useQuery({
    queryKey: ['projects', { page }],
    queryFn: () => getProjects(page),
    // page1 -> page2 데이터 유지 다시 전페이지로 이동해도.
    placeholderData: keepPreviousData,
  });
}

export function useProducts() {
  return useInfiniteQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    // 안쓰는건 _로 표기하는게 좋음. 지금은 공부용이니 적어놈
    getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    },
  });
}

export function useProduct(id: number | null) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['product', { id }],
    // id 타입에러 잡기 enabled 활용
    queryFn: () => getProduct(id!),
    enabled: !!id,
    placeholderData: () => {
      const cachedProducts = (
        queryClient.getQueryData(['products']) as {
          pages: Product[] | undefined;
        }
      )?.pages?.flat(2);

      if (cachedProducts) {
        return cachedProducts.find((item) => item.id === id);
      }
    },
  });
}
