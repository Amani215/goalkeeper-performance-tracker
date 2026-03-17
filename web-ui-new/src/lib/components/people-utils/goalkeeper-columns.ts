import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import { renderSnippet } from '../ui/data-table';
import avatar from '$lib/assets/placeholder.png';

export type Goalkeeper = {
	profile_picture: string;
	name: string;
	age: number;
};

export const columns: ColumnDef<Goalkeeper>[] = [
	{
		accessorKey: 'profile_picture',
		header: () => {
			const profileHeaderSnippet = createRawSnippet(() => ({
				render: () => `<div class="text-center">Profile</div>`
			}));
			return renderSnippet(profileHeaderSnippet, '');
		},
		cell: ({ row }) => {
			const profilePicCellSnippet = createRawSnippet<[object]>(() => {
				const url = row.getValue('profile_picture');
				return {
					render: () => `
                    <div class="flex justify-center items-center w-full">
                    <img src="${url}" alt="Profile Picture" class="h-10 w-10 rounded-full" onerror="this.onerror=null;this.src='${avatar}';"/>
                    </div>
					`
				};
			});

			return renderSnippet(profilePicCellSnippet);
		}
	},
	{
		accessorKey: 'name',
		header: 'Name'
	},
	{
		accessorKey: 'age',
		header: 'Age'
	}
];
