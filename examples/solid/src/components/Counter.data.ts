import { createSignal } from 'solid-js';
import { queryClient, rspc } from '../rspc';

export const CounterData = () => {
  const [loading, setLoading] = createSignal(true);

  const get = rspc.count.get.query([], {
    refetchOnWindowFocus: false,
    onSettled: () => setLoading(false)
  });

  const set = rspc.count.set.mutate({
    onMutate: () => setLoading(true),
    onSuccess: () => queryClient.invalidateQueries(["count.get"])
  })

  const isLoading = () => loading() || get.isLoading;


  return { get, set, isLoading }

};

