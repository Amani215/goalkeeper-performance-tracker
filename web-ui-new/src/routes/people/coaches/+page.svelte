<script lang="ts">
	import DataTable from '$lib/components/ui/data-table.svelte';
	import { columns } from '$lib/components/people-utils/columns.js';
	import AddDialog from '$lib/components/people-utils/add-person-dialog.svelte';

	let { data } = $props();
</script>

<div class="mb-4 flex w-full justify-end">
	<AddDialog />
</div>

<DataTable data={data.coaches} {columns} />
