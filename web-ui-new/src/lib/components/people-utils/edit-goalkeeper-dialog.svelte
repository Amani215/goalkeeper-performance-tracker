<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import Input from '../ui/input/input.svelte';
	import {
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		fromDate
	} from '@internationalized/date';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { Calendar } from '../ui/calendar';
	import { cn } from '$lib/utils';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let { name: initialName, birthday: initialBirthday, phone: initialPhone } = $props();

	let name = $state(initialName);
	let birthday = $state<DateValue>(initialBirthday ?? fromDate(new Date(), getLocalTimeZone()));
	let phone = $state(initialPhone);

	let contentRef = $state<HTMLElement | null>(null);
</script>

<Dialog.Root>
	<Dialog.Trigger class="w-50 {buttonVariants({ variant: 'default' })}">Edit</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Edit Goalkeeper</Dialog.Title>
			<Dialog.Description
				>Edit an existing goalkeeper here. Click save when you're done.</Dialog.Description
			>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Name</Label>
				<Input type="text" id="name" bind:value={name} class="col-span-3" />
			</div>

			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="date" class="text-right">Birthday</Label>
				<Popover.Root>
					<Popover.Trigger
						class="col-span-3 w-full {cn(
							buttonVariants({
								variant: 'outline',
								class: 'w-[280px] justify-start text-left font-normal'
							}),
							!birthday && 'text-muted-foreground'
						)}"
					>
						<CalendarIcon />
						{birthday
							? df.format(
									birthday instanceof Date
										? birthday
										: (birthday?.toDate?.(getLocalTimeZone()) ?? birthday)
								)
							: 'Pick a date'}
					</Popover.Trigger>
					<Popover.Content bind:ref={contentRef} class="w-auto p-0">
						<Calendar type="single" bind:value={birthday} captionLayout="dropdown" />
					</Popover.Content>
				</Popover.Root>
			</div>

			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="phone" class="text-right">Phone Number</Label>
				<Input type="text" id="phone" bind:value={phone} class="col-span-3" />
			</div>
		</div>
		<Dialog.Footer>
			<Button type="submit">Save changes</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
