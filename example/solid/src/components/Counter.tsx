import { Match, Switch } from "solid-js";
import { CounterData } from "./Counter.data";

export default function Counter() {
  const { get, set } = CounterData();

  return (
    <div style="margin-top: 10px;">
      <Switch>
        <Match when={get.isError}>
          <p textContent={get.error?.message} class="error-msg" />
        </Match>
      </Switch>

      <div style="display: flex; align-items: center; gap: 4px;">
        <button textContent="-" onClick={() => set.mutate("Dec")} />
        <output textContent={get.data ?? 0} />
        <button textContent="+" onClick={() => set.mutate("Inc")} />
      </div>
    </div>
  );
}
