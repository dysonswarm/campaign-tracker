"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { ComponentPropsWithoutRef, useState } from "react";

const groups = [
	{
		label: "Active Campaign",
		campaigns: [
			{
				label: "Campaign 1",
				value: "active_campaign",
			},
		],
	},
	{
		label: "Other Campaigns",
		campaigns: [
			{
				label: "Campaign 2",
				value: "campaign_2",
			},
			{
				label: "Campaign 3",
				value: "campaign_3",
			},
		],
	},
];

type Team = (typeof groups)[number]["campaigns"][number];

type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface CampaignSwitcherProps extends PopoverTriggerProps {}

export default function CampaignSwitcher({ className }: CampaignSwitcherProps) {
	const [open, setOpen] = useState(false);
	const [selectedTeam, setSelectedTeam] = useState<Team>(
		groups[0].campaigns[0],
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					aria-label="Select a team"
					className={cn("w-[200px] justify-between", className)}
				>
					<Avatar className="mr-2 h-5 w-5">
						<AvatarImage
							src={`https://avatar.vercel.sh/${selectedTeam.value}.png`}
							alt={selectedTeam.label}
							className="grayscale"
						/>
						<AvatarFallback>SC</AvatarFallback>
					</Avatar>
					{selectedTeam.label}
					<CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandList>
						<CommandInput placeholder="Search campaigns..." />
						<CommandEmpty>No team found.</CommandEmpty>
						{groups.map((group) => (
							<CommandGroup
								key={group.label}
								heading={group.label}
							>
								{group.campaigns.map((campaign) => (
									<CommandItem
										key={campaign.value}
										onSelect={() => {
											setSelectedTeam(campaign);
											setOpen(false);
										}}
										className="text-sm"
									>
										<Avatar className="mr-2 h-5 w-5">
											<AvatarImage
												src={`https://avatar.vercel.sh/${campaign.value}.png`}
												alt={campaign.label}
												className="grayscale"
											/>
											<AvatarFallback>SC</AvatarFallback>
										</Avatar>
										{campaign.label}
										<CheckIcon
											className={cn(
												"ml-auto h-4 w-4",
												selectedTeam.value ===
													campaign.value
													? "opacity-100"
													: "opacity-0",
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
