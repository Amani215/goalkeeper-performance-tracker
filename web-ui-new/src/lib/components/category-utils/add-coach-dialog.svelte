<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';

	const coaches = [
		{ id: '1', name: 'Fakhri Brik' },
		{ id: '2', name: 'John Doe' }
	];

	let id = $state('');

	const triggerNameContent = $derived(coaches.find((n) => n.id === id)?.name ?? 'Select a coach');
</script>

<Dialog.Root>
	<Dialog.Trigger class="w-30 {buttonVariants({ variant: 'ghost' })}">Add Coach</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Add Coach</Dialog.Title>
			<Dialog.Description>Add a coach here. Click save when you're done.</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<!-- Coach Names Select -->
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Coach</Label>
				<Select.Root type="single" name="coachId" bind:value={id}>
					<Select.Trigger class="col-span-3 w-full">
						{triggerNameContent}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Coach</Select.Label>
							{#each coaches as coach (coach.id)}
								<Select.Item value={coach.id} label={coach.name}>
									{coach.name}
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
