<script lang="ts">
	import { Badge } from '../ui/badge';

	let {
		categories
	}: {
		categories: {
			id: string;
			name: string;
			season: string;
			archived?: boolean;
		}[];
	} = $props();
</script>

{#if categories.length === 0}
	<p>No categories yet...</p>
{:else}
	<div class="flex flex-wrap gap-1">
		{#each categories as category}
			{#if category.archived}
				<Badge variant="secondary" href="/categories/{category.id}"
					>{category.name} (Archived)</Badge
				>
			{:else}
				<Badge href="/categories/{category.id}">{category.name}</Badge>
			{/if}
		{/each}
	</div>
{/if}
