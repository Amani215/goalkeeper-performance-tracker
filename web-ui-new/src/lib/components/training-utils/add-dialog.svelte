<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	const categories = [
		{ value: 'seniors2021_2022', label: 'Seniors 2021-2022' },
		{ value: 'seniors2022_2023', label: 'Seniors 2022-2023' },
		{ value: 'seniors2023_2024', label: 'Seniors 2023-2024' }
	];

	let date = $state<DateValue | undefined>();
	let contentRef = $state<HTMLElement | null>(null);

	let duration = $state(0);
	let category = $state('');

	const triggerCategoryContent = $derived(
		categories.find((n) => n.value === category)?.label ?? 'Select a category'
	);
</script>

<Dialog.Root>
	<Dialog.Trigger class="w-50 {buttonVariants({ variant: 'default' })}"
		>Add Training Session</Dialog.Trigger
	>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Add Training Session</Dialog.Title>
			<Dialog.Description
				>Add a new training session here. Click save when you're done.</Dialog.Description
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

			<!-- Duration input -->
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="duration" class="text-right">Duration</Label>
				<Input type="number" id="duration" bind:value={duration} class="col-span-3" />
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
		</div>

		<Dialog.Footer>
			<Button type="submit">Save changes</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
