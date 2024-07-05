type FlightProps = {
	flightNumber: string;
};

export async function Flight({ flightNumber }: FlightProps) {
	const data = await (await fetch(`https://jsonplaceholder.typicode.com/todos/1`)).json();

	return (
		<div>
			<div>{flightNumber}</div>
			<div>{data.title}</div>
			<div>{data.source}</div>
			<div>{data.destination}</div>
		</div>
	);
}
