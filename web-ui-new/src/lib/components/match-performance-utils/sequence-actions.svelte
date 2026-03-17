<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import PencilLine from '@lucide/svelte/icons/pencil-line';

	let sequence = $props();
</script>

<div class="flex justify-end gap-2">
	<Button size="icon" variant="ghost"><PencilLine /></Button>

	<Button size="icon" variant="ghost"><Trash2 /></Button>
</div>
