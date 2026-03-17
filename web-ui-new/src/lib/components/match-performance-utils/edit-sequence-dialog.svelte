<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import Input from '../ui/input/input.svelte';
	import PencilLine from '@lucide/svelte/icons/pencil-line';

	let { num: initialNum, action: initialAction, reaction: initialReaction, result: initialResult, comment: initialComment } = $props();

	let num = $state(initialNum);
	let action = $state(initialAction);
    let reaction = $state(initialReaction);
    let result = $state(initialResult);
    let comment = $state(initialComment);
</script>

<Dialog.Root>
	<Dialog.Trigger class=" {buttonVariants({ variant: 'ghost' })}">
        <Button variant="ghost" size="icon" aria-label="Submit">
            <PencilLine />
        </Button>
    </Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Edit Sequence</Dialog.Title>
			<Dialog.Description
				>Edit an existing sequence here. Click save when you're done.</Dialog.Description
			>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="num" class="text-right">Num</Label>
				<Input type="text" id="num" bind:value={num} class="col-span-3" />
			</div>

			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="action" class="text-right">Action</Label>
				<Input type="text" id="action" bind:value={action} class="col-span-3" />
			</div>

            <div class="grid grid-cols-4 items-center gap-4">
				<Label for="reaction" class="text-right">Reaction</Label>
				<Input type="text" id="reaction" bind:value={reaction} class="col-span-3" />
			</div>

            <div class="grid grid-cols-4 items-center gap-4">
				<Label for="result" class="text-right">Result</Label>
				<Input type="text" id="result" bind:value={result} class="col-span-3" />
			</div>

            <div class="grid grid-cols-4 items-center gap-4">
				<Label for="comment" class="text-right">Comment</Label>
				<Input type="text" id="comment" bind:value={comment} class="col-span-3" />
			</div>
		</div>
		<Dialog.Footer>
			<Button type="submit">Save changes</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
