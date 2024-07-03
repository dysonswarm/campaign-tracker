export async function Stock({
  symbol,
  numOfMonths,
}: {
  symbol: string;
  numOfMonths: number;
}) {
  const data = await (
    await fetch(`https://jsonplaceholder.typicode.com/todos`)
  ).json();

  return (
    <div>
      <div>
        {symbol} - {numOfMonths}
      </div>

      <div>
        {data.map((data: { id: number; title: string; completed: boolean }) => (
          <div key={data.id}>
            <div>{data.title}</div>
            <div>{data.completed ? "True" : "False"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
