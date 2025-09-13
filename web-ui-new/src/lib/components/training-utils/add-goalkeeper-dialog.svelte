<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';

	let goalkeeper = $state('');

	const goalkeepers = [
		{ value: '1', label: 'John Doe' },
		{ value: '2', label: 'Jane Smith' },
		{ value: '3', label: 'Mike Johnson' }
	];

	const triggerGoalkeeperContent = $derived(
		goalkeepers.find((n) => n.value === goalkeeper)?.label ?? 'Select a goalkeeper'
	);
</script>

<Dialog.Root>
	<Dialog.Trigger class="w-50 {buttonVariants({ variant: 'default' })}"
		>Add Goalkeeper</Dialog.Trigger
	>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Add Goalkeeper</Dialog.Title>
			<Dialog.Description
				>Add a participating goalkeeper here. Click save when you're done.</Dialog.Description
			>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<!-- Goalkeeper Select -->
			<div class="grid grid-cols-4 items-center gap-4">
				<Select.Root type="single" name="goalkeeper" bind:value={goalkeeper}>
					<Select.Trigger class="col-span-4 w-full">
						{triggerGoalkeeperContent}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Goalkeeper</Select.Label>
							{#each goalkeepers as goalkeeper (goalkeeper.value)}
								<Select.Item value={goalkeeper.value} label={goalkeeper.label}>
									{goalkeeper.label}
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
		</div>

		<Dialog.Footer>
			<Button type="submit">Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
