<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import Input from '../../ui/input/input.svelte';
	import Pencil from '@lucide/svelte/icons/pencil';
	import {
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		fromDate
	} from '@internationalized/date';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { Calendar } from '../../ui/calendar';
	import { cn } from '$lib/utils';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let {
		date: initialDate,
		height: initialHeight,
		weight: initialWeight,
		torsoHeight: initialTorsoHeight,
		thoracicPerimeter: initialThoracicPerimeter
	} = $props();

	let date = $state<DateValue>(initialDate ?? fromDate(new Date(), getLocalTimeZone()));
	let height = $state(initialHeight);
	let weight = $state(initialWeight);
	let torsoHeight = $state(initialTorsoHeight);
	let thoracicPerimeter = $state(initialThoracicPerimeter);

	let contentRef = $state<HTMLElement | null>(null);
</script>

<Dialog.Root>
	<Dialog.Trigger class="w-10 {buttonVariants({ variant: 'ghost' })}"
		><Button variant="ghost" size="icon" aria-label="Submit">
			<Pencil />
		</Button></Dialog.Trigger
	>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Edit Growth</Dialog.Title>
			<Dialog.Description
				>Edit an existing growth record here. Click save when you're done.</Dialog.Description
			>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="date" class="text-right">Birthday</Label>
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
						{date
							? df.format(
									date instanceof Date ? date : (date?.toDate?.(getLocalTimeZone()) ?? date)
								)
							: 'Pick a date'}
					</Popover.Trigger>
					<Popover.Content bind:ref={contentRef} class="w-auto p-0">
						<Calendar type="single" bind:value={date} captionLayout="dropdown" />
					</Popover.Content>
				</Popover.Root>
			</div>

			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Height</Label>
				<Input type="text" id="name" bind:value={height} class="col-span-3" />
			</div>

			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="phone" class="text-right">Weight</Label>
				<Input type="text" id="phone" bind:value={weight} class="col-span-3" />
			</div>

			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="phone" class="text-right">Torso Height</Label>
				<Input type="text" id="phone" bind:value={torsoHeight} class="col-span-3" />
			</div>

			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="phone" class="text-right">Thoracic Perimeter</Label>
				<Input type="text" id="phone" bind:value={thoracicPerimeter} class="col-span-3" />
			</div>
		</div>
		<Dialog.Footer>
			<Button type="submit">Save changes</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
