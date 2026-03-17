<script lang="ts">
	import DataTable from '$lib/components/ui/data-table.svelte';
	import { columns } from '$lib/components/people-utils/columns.js';
	import AddDialog from '$lib/components/people-utils/add-person-dialog.svelte';

	let { data } = $props();
</script>

<div class="mb-4 flex w-full md:justify-end justify-center">
	<AddDialog />
</div>

<DataTable data={data.admins} {columns} rowLink={(id) => `/profile/${id}`} />
