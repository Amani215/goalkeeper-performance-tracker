<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import EditSequenceDialog from './edit-sequence-dialog.svelte';
	import type { Sequence } from './sequence-columns';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

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

	<AlertDialog.Root>
		<AlertDialog.Trigger class={buttonVariants({ variant: 'ghost' })}>
			<Button variant="ghost" size="icon" aria-label="Submit">
				<Trash2 />
			</Button>
		</AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
				<AlertDialog.Description>
					This action cannot be undone. This will permanently delete the record.
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action>Continue</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>
