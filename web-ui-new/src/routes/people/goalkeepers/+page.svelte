<script lang="ts">
	import DataTable from '$lib/components/ui/data-table.svelte';
	import { columns } from '$lib/components/people-utils/goalkeeper-columns.js';
	import AddGoalkeeperDialog from '$lib/components/people-utils/add-goalkeeper-dialog.svelte';

	let { data } = $props();
</script>

<div class="mb-4 flex w-full md:justify-end justify-center">
	<AddGoalkeeperDialog />
</div>

<DataTable data={data.goalkeepers} {columns} rowLink={(id) => `/people/goalkeepers/${id}`} />
