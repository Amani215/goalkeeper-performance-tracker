<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';

	const names = [
		{ value: 'seniors', label: 'Seniors' },
		{ value: 'juniors', label: 'Juniors' },
		{ value: 'cadets_a', label: 'Cadets A' },
		{ value: 'cadets_b', label: 'Cadets B' },
		{ value: 'minimes_a', label: 'Minimes A' }
	];
	const seasons = [
		{ value: '2023-2024', label: '2023-2024' },
		{ value: '2024-2025', label: '2024-2025' },
		{ value: '2025-2026', label: '2025-2026' },
		{ value: '2026-2027', label: '2026-2027' },
		{ value: '2027-2028', label: '2027-2028' }
	];

	let name = $state('');
	let season = $state('');

	const triggerNameContent = $derived(
		names.find((n) => n.value === name)?.label ?? 'Select a category name'
	);
	const triggerSeasonContent = $derived(
		seasons.find((n) => n.value === season)?.label ?? 'Select a season'
	);
</script>

<Dialog.Root>
	<Dialog.Trigger class="w-50 mr-4 lg:mr-8 {buttonVariants({ variant: 'default' })}">
		Add Category
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Add Category</Dialog.Title>
			<Dialog.Description>Add a new category here. Click save when you're done.</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<!-- Category Names Select -->
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Name</Label>
				<Select.Root type="single" name="categoryName" bind:value={name}>
					<Select.Trigger class="col-span-3 w-full">
						{triggerNameContent}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Name</Select.Label>
							{#each names as name (name.value)}
								<Select.Item value={name.value} label={name.label}>
									{name.label}
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>

			<!-- Seasons Select -->
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="season" class="text-right">Season</Label>
				<Select.Root type="single" name="season" bind:value={season}>
					<Select.Trigger class="col-span-3 w-full">
						{triggerSeasonContent}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Season</Select.Label>
							{#each seasons as season (season.value)}
								<Select.Item value={season.value} label={season.label}>
									{season.label}
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
		</div>
		<Dialog.Footer>
			<Button type="submit">Save changes</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
