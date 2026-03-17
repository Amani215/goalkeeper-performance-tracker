<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import EditSequenceDialog from './edit-sequence-dialog.svelte';
	import type { Sequence } from './sequence-columns';

	export let sequence: Sequence ;
	console.log(sequence)
</script>

<div class="flex justify-end gap-2">
	<EditSequenceDialog
	  num={sequence.num}
	  action={sequence.action}
	  reaction={sequence.reaction}
	  result={sequence.result}
	  comment={sequence.comment}
	/>

	<Button size="icon" variant="ghost"><Trash2 /></Button>
</div>
