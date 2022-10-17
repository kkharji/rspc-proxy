import { queryClient, rspc } from '../rspc';

export const CounterData = () => {

  const get = rspc.count.get.query([], {
    refetchOnWindowFocus: false,
  });

  const set = rspc.count.set.mutate({
    onSuccess: () => queryClient.invalidateQueries(["count.get"])
  })
  return { get, set }

};

