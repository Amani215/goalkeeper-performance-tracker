<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import PenLine from '@lucide/svelte/icons/pen-line';
	import { Label } from '../ui/label';
	import { Input } from '../ui/input';

	const attendanceList = [{ label: 'Present' }, { label: 'Absent' }, { label: 'Hurt' }];

	let attendance = $state(attendanceList[0].label);
	let duration = $state(0);

	const triggerAttendanceContent = $derived(
		attendanceList.find((n) => n.label === attendance)?.label ?? 'Select an attendance status'
	);
</script>

<Dialog.Root>
	<!-- svelte-ignore attribute_quoted -->
	<Dialog.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}
		><PenLine /></Dialog.Trigger
	>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Update Attendance</Dialog.Title>
			<Dialog.Description
				>Update the attendance status of the selected goalkeeper. Click save when you're done.</Dialog.Description
			>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<!-- Attendance Select -->
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="duration" class="col-span-2 text-right">Attendance</Label>
				<Select.Root type="single" name="goalkeeper" bind:value={attendance}>
					<Select.Trigger class="col-span-2 w-full">
						{triggerAttendanceContent}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Attendance</Select.Label>
							{#each attendanceList as attendance (attendance.label)}
								<Select.Item value={attendance.label} label={attendance.label}>
									{attendance.label}
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>

			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="duration" class="col-span-2 text-right">Attendance Time</Label>
				<Input type="number" id="duration" bind:value={duration} class="col-span-2" />
			</div>
		</div>

		<Dialog.Footer>
			<Button type="submit">Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
