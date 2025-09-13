<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import profilePic from '$lib/assets/placeholder.png';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Switch } from '$lib/components/ui/switch';
	import Label from '$lib/components/ui/label/label.svelte';

	let admin = true;
	let archived = false;
</script>

<Card class="p-8 ">
	<div class="grid grid-cols-6 grid-rows-2 gap-6">
		<img
			src={profilePic}
			alt="Profile Pic"
			class="col-span-1 row-span-1 h-32 w-32 justify-self-center rounded-full"
		/>

		<div class="col-span-5 row-span-1 content-center">
			<h2 class="mb-4 text-xl font-bold {archived ? 'italic text-gray-500' : ''}">
				John Doe {archived ? '(Archived)' : ''}
			</h2>
			<h3 class="text-l -mt-4 mb-2 text-gray-500">{admin ? 'Admin' : 'Coach'}</h3>
		</div>

		<Button variant="outline" size="sm">Change Picture</Button>
		<div class="col-start-2 col-end-7 row-span-5 space-y-4">
			<div class="flex items-center space-x-2">
				<Switch bind:checked={archived} />
				<Label for="admin-switch">{archived ? 'Unarchive' : 'Archive'}</Label>
			</div>

			<div class="flex items-center space-x-2">
				<Switch bind:checked={admin} />
				<Label for="admin-switch">{admin ? 'Revoke Admin' : 'Make Admin'}</Label>
			</div>

			<div class="mt-6">
				<h3 class="text-l font-semibold">Associated Categories:</h3>
				<p class="mb-4">No categories yet</p>
			</div>
		</div>
	</div>
	<div class="flex flex-row gap-6"></div>
</Card>
