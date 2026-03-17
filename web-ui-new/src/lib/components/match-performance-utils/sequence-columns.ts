import { createColumnHelper, type ColumnDef } from '@tanstack/table-core';
import SequenceActions from './sequence-actions.svelte';
import { renderComponent } from '../ui/data-table';
import ActionsHeader from './actions-header.svelte';

export type Sequence = {
	num: number;
	action: string;
	reaction: string;
	result: string;
	comment: string;
};

const columnHelper = createColumnHelper<Sequence>();

export const columns: ColumnDef<Sequence, any>[] = [
	columnHelper.accessor('num', {
		header: 'Num'
	}),
	columnHelper.accessor('action', {
		header: 'Action'
	}),
	columnHelper.accessor('reaction', {
		header: 'Reaction'
	}),
	columnHelper.accessor('result', {
		header: 'Result'
	}),
	columnHelper.accessor('comment', {
		header: 'Comment'
	}),
	columnHelper.display({
		id: 'actions',
		header: () => renderComponent(ActionsHeader, { text: 'Actions' }),
		cell: ({ row }) =>
			renderComponent(SequenceActions, {
				sequence: row.original
			})
	})
];
