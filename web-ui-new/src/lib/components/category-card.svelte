<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';

	let {
		category
	}: {
		category: {
			name: string;
			season: string;
		};
	} = $props();
</script>

<Card.Root class="w-60">
	<Card.Header>
		<Card.Title>{category.name}</Card.Title>
		<Card.Description>{category.season}</Card.Description>
	</Card.Header>
	<Card.Content>
		<Button class="mb-2 w-full">View Category</Button>
		<Button variant="secondary" class="w-full">Archive Category</Button>
	</Card.Content>
</Card.Root>
