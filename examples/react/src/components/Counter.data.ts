import { queryClient, hooks } from '../rspc';

export const CounterData = () => {

  const get = hooks.useQuery(["count.get"], {
    refetchOnWindowFocus: false,
  })

  const set = hooks.useMutation(["count.set"], {
    onSuccess: () => queryClient.invalidateQueries(["count.get"])
  })

  return { get, set }

};


  // const get = rspc.count.get.query([], {
  //   refetchOnWindowFocus: false,
  // });

  // const set = rspc.count.set.mutate({
  //   onSuccess: () => queryClient.invalidateQueries(["count.get"])
  // })
