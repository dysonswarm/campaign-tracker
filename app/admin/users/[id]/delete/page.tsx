export default async function UserDelete({
	params,
}: {
	params: { id: string };
}) {
	return (
		<div>
			<h1>Delete User</h1>
			<form method="POST" action={`/admin/users/${params.id}/delete`}>
				<button type="submit">Delete</button>
			</form>
		</div>
	);
}
