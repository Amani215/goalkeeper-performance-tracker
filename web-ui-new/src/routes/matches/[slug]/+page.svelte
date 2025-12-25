<script>
	import AddGoalkeeperDialog from '$lib/components/match-utils/add-goalkeeper-dialog.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import FileChartPie from '@lucide/svelte/icons/file-chart-pie';
	import EditMatchDialog from '$lib/components/match-utils/edit-dialog.svelte';

	let goalkeepers = [{ name: 'John Doe' }, { name: 'Jane Smith' }];
</script>

<div class="flex w-full justify-end">
	<EditMatchDialog />
</div>

<div class="mb-6 flex flex-col items-center gap-2">
	<p class="text-3xl font-bold">Tournament (Draw)</p>
	<p class="text-2xl">Senior 2021-2022</p>
	<p class="text-xl font-bold">22/10/2021</p>
</div>

<div class=" flex w-full flex-row justify-center gap-2">
	<Card class="w-full items-center p-4">
		<p class="text-2xl font-bold">EST</p>
		<p class="text-xl font-bold">2</p>
	</Card>
	<Card class="w-full items-center p-4">
		<p class="text-2xl font-bold">CA</p>
		<p class="text-xl font-bold">1</p>
	</Card>
</div>

<Card class="mt-6 w-full p-4">
	<div class="flex w-full justify-end">
		<AddGoalkeeperDialog />
	</div>
	{#if goalkeepers.length === 0}
		<p class="mt-2 text-center text-sm">No goalkeepers added yet...</p>
	{:else}
		{#each goalkeepers as goalkeeper}
			<div class="flex flex-row justify-between">
				<p>{goalkeeper.name}</p>
				<div class="flex flex-row">
					<Button size="icon" variant="ghost"><FileChartPie /></Button>
					<Button size="icon" variant="ghost"><Trash2 /></Button>
				</div>
			</div>
			<Separator class="-mt-4" />
		{/each}
	{/if}
</Card>
