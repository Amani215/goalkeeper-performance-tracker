<script lang="ts">
	import DataTable from '$lib/components/ui/data-table.svelte';
	import { columns } from '$lib/components/people-utils/columns.js';

	let { data } = $props();
</script>

<DataTable data={data.coaches} {columns} />
