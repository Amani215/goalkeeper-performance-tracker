<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';

	let {
		category
	}: {
		category: {
			name: string;
			season: string;
			archived?: boolean;
		};
	} = $props();
</script>

<Card.Root class="w-full lg:w-1/5 xl:w-1/6">
	<Card.Header>
		<Card.Title>{category.name}</Card.Title>
		<Card.Description>{category.season}</Card.Description>
	</Card.Header>
	<Card.Content>
		<Button class="mb-2 w-full">View Category</Button>
		{#if category.archived}
			<Button variant="secondary" class="w-full">Unarchive</Button>
		{:else}
			<Button variant="secondary" class="w-full">Archive Category</Button>
		{/if}
	</Card.Content>
</Card.Root>
