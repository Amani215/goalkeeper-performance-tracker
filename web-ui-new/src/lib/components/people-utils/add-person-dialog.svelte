<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import Checkbox from '../ui/checkbox/checkbox.svelte';
	import Input from '../ui/input/input.svelte';

	let name = $state('');
	let password = $state('');
	let admin = $state(false);
</script>

<Dialog.Root>
	<Dialog.Trigger class="w-50 {buttonVariants({ variant: 'default' })}">Add Person</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Add Person</Dialog.Title>
			<Dialog.Description>Add a new person here. Click save when you're done.</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Name</Label>
				<Input type="text" id="name" bind:value={name} class="col-span-3" />
			</div>

			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="season" class="text-right">Season</Label>
				<Input type="password" id="password" bind:value={password} class="col-span-3" />
			</div>

			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="admin" class="text-right">Admin</Label>
				<Checkbox id="admin" bind:checked={admin} class="col-span-3" />
			</div>
		</div>
		<Dialog.Footer>
			<Button type="submit">Save changes</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
