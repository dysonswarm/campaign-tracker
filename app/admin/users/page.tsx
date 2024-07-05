import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export default async function Users() {
	const session = await auth();
	if (session?.user?.role !== "admin") {
		throw new Error("Unauthorized");
	}

	const users = await prisma.user.findMany();

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Id</TableHead>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{users.map((user) => (
					<TableRow key={user.id}>
						<TableCell>{user.id}</TableCell>
						<TableCell>{user.name}</TableCell>
						<TableCell>{user.email}</TableCell>
						<TableCell>{user.role}</TableCell>
						<TableCell>
							<a href={`/admin/users/${user.id}/edit`}>Edit</a> |{" "}
							<a href={`/admin/users/${user.id}/delete`}>Delete</a>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
