<script lang="ts">
	import DataTable from '$lib/components/ui/data-table.svelte';
	import { columns } from '$lib/components/people-utils/goalkeeper-columns.js';
	import AddGoalkeeperDialog from '$lib/components/people-utils/add-goalkeeper-dialog.svelte';

	let { data } = $props();
</script>

<div class="mb-4 flex w-full justify-end">
	<AddGoalkeeperDialog />
</div>

<DataTable data={data.goalkeepers} {columns} />
