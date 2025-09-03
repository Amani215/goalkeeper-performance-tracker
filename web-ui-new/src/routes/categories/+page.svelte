<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import CategoryCard from '$lib/components/category-utils/category-card.svelte';
	import AddDialog from '$lib/components/category-utils/add-dialog.svelte';
</script>

<div class="mb-4 flex w-full justify-end">
	<AddDialog />
</div>
<div class="flex flex-wrap justify-center gap-4">
	<CategoryCard category={{ name: 'Seniors', season: '2024-2025' }} />
	<CategoryCard category={{ name: 'Juniors', season: '2024-2025' }} />
	<CategoryCard category={{ name: 'Cadets A', season: '2024-2025' }} />
	<CategoryCard category={{ name: 'Cadets B', season: '2024-2025' }} />
	<CategoryCard category={{ name: 'Minimes A', season: '2024-2025' }} />

	<CategoryCard category={{ name: 'Juniors', season: '2024-2025' }} />
	<CategoryCard category={{ name: 'Cadets A', season: '2024-2025' }} />
	<CategoryCard category={{ name: 'Cadets B', season: '2024-2025' }} />
	<CategoryCard category={{ name: 'Minimes A', season: '2024-2025' }} />
</div>

<div class="flex w-full justify-center">
	<Collapsible.Root class="mt-8 w-full">
		<Collapsible.Trigger class="w-full {buttonVariants({ variant: 'ghost' })}">
			<div class="flex w-full justify-between px-4">
				<h4 class="text-sm font-semibold">Archived Categories</h4>
				<div>
					<ChevronsUpDownIcon />
					<span class="sr-only">Toggle</span>
				</div>
			</div>
		</Collapsible.Trigger>
		<Collapsible.Content class="mt-4">
			<div class="flex flex-wrap justify-center gap-4">
				<CategoryCard category={{ name: 'Seniors', season: '2023-2024', archived: true }} />
			</div>
		</Collapsible.Content>
	</Collapsible.Root>
</div>
