<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';

	const goalkeeperes = [
		{ id: '1', name: 'Mehdi Brik' },
		{ id: '2', name: 'Fares Brik' }
	];

	let id = $state('');

	const triggerNameContent = $derived(
		goalkeeperes.find((n) => n.id === id)?.name ?? 'Select a goalkeeper'
	);
</script>

<Dialog.Root>
	<Dialog.Trigger class="w-30 {buttonVariants({ variant: 'ghost' })}">Add Goalkeeper</Dialog.Trigger
	>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Add goalkeeper</Dialog.Title>
			<Dialog.Description>Add a goalkeeper here. Click save when you're done.</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<!-- Goalkeeper Names Select -->
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">goalkeeper</Label>
				<Select.Root type="single" name="goalkeeperId" bind:value={id}>
					<Select.Trigger class="col-span-3 w-full">
						{triggerNameContent}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>goalkeeper</Select.Label>
							{#each goalkeeperes as goalkeeper (goalkeeper.id)}
								<Select.Item value={goalkeeper.id} label={goalkeeper.name}>
									{goalkeeper.name}
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
