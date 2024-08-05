import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { prisma } from "@/lib/db";
import { editUser } from "./actions";

const roles = ["user", "admin", "trusted"];

export default async function UserEdit({ params }: { params: { id: string } }) {
	const editUserWithId = editUser.bind(null, params.id);
	const user = await prisma.user.findUniqueOrThrow({
		where: { id: params.id },
	});
	return (
		<div>
			<h1>
				Edit {user.name} - {user.email} - {user.role}
			</h1>
			<form action={editUserWithId}>
				<Select name="role" defaultValue={user.role}>
					<SelectTrigger>
						<SelectValue placeholder="Select a role..." />
					</SelectTrigger>
					<SelectContent>
						{roles.map((role) => (
							<SelectItem key={role} value={role}>
								{role}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<button type="submit">Save</button>
			</form>
		</div>
	);
}
