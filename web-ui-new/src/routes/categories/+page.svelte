<script lang="ts">
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import CategoryCard from '$lib/components/category-card.svelte';
</script>

<div class="m-8 justify-center">
	<Button class="w-50 mb-4 self-end">Add Category</Button>
	<div class="flex flex-wrap justify-start gap-4">
		<CategoryCard category={{ name: 'Seniors', season: '2024-2025' }} />
		<CategoryCard category={{ name: 'Juniors', season: '2024-2025' }} />
		<CategoryCard category={{ name: 'Cadets A', season: '2024-2025' }} />
		<CategoryCard category={{ name: 'Cadets B', season: '2024-2025' }} />
		<CategoryCard category={{ name: 'Minimes A', season: '2024-2025' }} />
	</div>

	<Collapsible.Root class="w-260 m-8 space-y-2 self-center">
		<Collapsible.Trigger class={buttonVariants({ variant: 'ghost' })}>
			<div class="w-240 flex justify-between space-x-4 px-4">
				<h4 class="text-sm font-semibold">Archived Categories</h4>
				<div>
					<ChevronsUpDownIcon />
					<span class="sr-only">Toggle</span>
				</div>
			</div>
		</Collapsible.Trigger>
		<Collapsible.Content class="space-y-2">
			<div class="flex flex-wrap justify-center">
				<CategoryCard category={{ name: 'Seniors', season: '2023-2024' }} />
			</div>
		</Collapsible.Content>
	</Collapsible.Root>
</div>
