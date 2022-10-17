import { CounterData } from "./Counter.data";

export default function Counter() {
  const { get, set } = CounterData();

  return (
    <div style={{ "marginTop": "10px" }}>
      {get.isError &&
        <p>{get.error?.message}</p>
      }
      <div style={{ display: "flex", "alignItems": "center", "gap": "4px" }}>
        <button children="-" onClick={() => set.mutate("Dec")} />
        <output children={get.data ?? 0} />
        <button children="+" onClick={() => set.mutate("Inc")} />
      </div>
    </div>
  );
}
