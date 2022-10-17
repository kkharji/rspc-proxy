const P = () => { }

type ProxyCbArgs = { keys: string[], params: unknown[]; }
type ProxyCb = (args: ProxyCbArgs) => unknown;

export const _createProxy = (cb: ProxyCb, keys: string[] = []): unknown =>
  new Proxy(P, {
    apply: (_0, _1, params) => cb({ params, keys }),
    get: (_, k) => (typeof k === 'string' && k !== 'then')
      ? _createProxy(cb, [...keys, k])
      : undefined
  });
