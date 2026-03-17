<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import PencilLine from '@lucide/svelte/icons/pencil-line';
	import {
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		fromDate
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import Input from '../ui/input/input.svelte';
	import { Field, FieldLabel } from '$lib/components/ui/field';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	const teams = [
		{ value: 'CA', label: 'CA' },
		{ value: 'EST', label: 'EST' },
		{ value: 'ASM', label: 'ASM' }
	];
	const types = [
		{ value: 'friendly', label: 'Friendly' },
		{ value: 'Tournament', label: 'Tournament' }
	];
	const categories = [
		{ value: 'seniors2021_2022', label: 'Seniors 2021-2022' },
		{ value: 'seniors2022_2023', label: 'Seniors 2022-2023' },
		{ value: 'seniors2023_2024', label: 'Seniors 2023-2024' }
	];

	let { localTeam, visitorTeam, type, category, matchDate, localTeamScore, visitorTeamScore } =
		$props();

	let date = $state<DateValue | undefined>(
		matchDate ? fromDate(new Date(matchDate), getLocalTimeZone()) : undefined
	);
	let contentRef = $state<HTMLElement | null>(null);

	const triggerLocalTeamContent = $derived(
		teams.find((t) => t.value === localTeam)?.label ?? 'Select a local team'
	);
	const triggerVisitorTeamContent = $derived(
		teams.find((t) => t.value === visitorTeam)?.label ?? 'Select a visitor team'
	);
	const triggerTypeContent = $derived(
		types.find((n) => n.value === type)?.label ?? 'Select a type'
	);
	const triggerCategoryContent = $derived(
		categories.find((n) => n.value === category)?.label ?? 'Select a category'
	);
</script>

<Dialog.Root>
	<Dialog.Trigger class="w-50 {buttonVariants({ variant: 'outline' })}"
		><PencilLine /> Edit Match Data</Dialog.Trigger
	>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Edit Match</Dialog.Title>
			<Dialog.Description
				>Edit the match details here. Click save when you're done.</Dialog.Description
			>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<!-- Date Select -->
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="date" class="text-right">Date</Label>
				<Popover.Root>
					<Popover.Trigger
						class="col-span-3 w-full {cn(
							buttonVariants({
								variant: 'outline',
								class: 'w-[280px] justify-start text-left font-normal'
							}),
							!date && 'text-muted-foreground'
						)}"
					>
						<CalendarIcon />
						{date ? df.format(date.toDate(getLocalTimeZone())) : 'Pick a date'}
					</Popover.Trigger>
					<Popover.Content bind:ref={contentRef} class="w-auto p-0">
						<Calendar type="single" bind:value={date} />
					</Popover.Content>
				</Popover.Root>
			</div>

			<!-- Type Select -->
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="type" class="text-right">Type</Label>
				<Select.Root type="single" name="type" bind:value={type}>
					<Select.Trigger class="col-span-3 w-full">
						{triggerTypeContent}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Season</Select.Label>
							{#each types as type (type.value)}
								<Select.Item value={type.value} label={type.label}>
									{type.label}
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>

			<!-- Category Select -->
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="category" class="text-right">Category</Label>
				<Select.Root type="single" name="category" bind:value={category}>
					<Select.Trigger class="col-span-3 w-full">
						{triggerCategoryContent}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Category</Select.Label>
							{#each categories as category (category.value)}
								<Select.Item value={category.value} label={category.label}>
									{category.label}
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>

			<!-- Local Team -->
			<Field>
				<Field class="grid grid-cols-2 gap-4">
					<Field>
						<FieldLabel for="local">Local Team</FieldLabel>
						<Select.Root type="single" name="local" bind:value={localTeam}>
							<Select.Trigger class="col-span-3 w-full">
								{triggerLocalTeamContent}
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									<Select.Label>Local Team</Select.Label>
									{#each teams as team (team.value)}
										<Select.Item value={team.value} label={team.label}>
											{team.label}
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</Field>
					<Field>
						<FieldLabel for="local-team-score">Score</FieldLabel>
						<Input id="local-team-score" type="number" bind:value={localTeamScore} />
					</Field>
				</Field>
			</Field>

			<!-- Visitor Team Select -->
			<Field>
				<Field class="grid grid-cols-2 gap-4">
					<Field>
						<FieldLabel for="visitor">Visitor Team</FieldLabel>
						<Select.Root type="single" name="visitor" bind:value={visitorTeam}>
							<Select.Trigger class="col-span-3 w-full">
								{triggerVisitorTeamContent}
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									<Select.Label>Season</Select.Label>
									{#each teams as team (team.value)}
										<Select.Item value={team.value} label={team.label}>
											{team.label}
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</Field>
					<Field>
						<FieldLabel for="visitor-team-score">Score</FieldLabel>
						<Input id="visitor-team-score" type="number" bind:value={visitorTeamScore} />
					</Field>
				</Field>
			</Field>
		</div>

		<Dialog.Footer>
			<Button type="submit">Save changes</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
