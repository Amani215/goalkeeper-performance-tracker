<script lang="ts" module>
	import Users from '@lucide/svelte/icons/users';
	import CalendarDays from '@lucide/svelte/icons/calendar-days';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import FrameIcon from '@lucide/svelte/icons/frame';
	import CircleGauge from '@lucide/svelte/icons/circle-gauge';
	import Boxes from '@lucide/svelte/icons/boxes';
	import LandPlot from '@lucide/svelte/icons/land-plot';
	import avatar from '$lib/assets/placeholder.png';

	const data = {
		user: {
			name: 'John Doe',
			title: 'Admin',
			avatar: avatar
		},
		teams: [
			{
				name: 'FootTrack',
				logo: CircleGauge,
				plan: 'Enterprise'
			}
		],
		navMain: [
			{
				title: 'Dashboard',
				url: '/#',
				icon: LayoutDashboard,
				isActive: true
			},
			{
				title: 'People',
				url: '#',
				icon: Users,
				items: [
					{
						title: 'Admins',
						url: '#'
					},
					{
						title: 'Coaches',
						url: '/people/coaches'
					},
					{
						title: 'Goalkeepers',
						url: '/people/goalkeepers'
					}
				]
			},
			{
				title: 'Categories',
				url: '/categories',
				icon: Boxes
			},
			{
				title: 'Trainings',
				url: '#',
				icon: CalendarDays
			},
			{
				title: 'Matches',
				url: '/matches',
				icon: LandPlot
			}
		],
		admin: [
			{
				title: 'Parameters',
				url: '#',
				icon: FrameIcon
			}
		]
	};
</script>

<script lang="ts">
	import NavMain from './nav-main.svelte';
	import NavUser from './nav-user.svelte';
	import TeamSwitcher from './team-switcher.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root {collapsible} {...restProps}>
	<Sidebar.Header>
		<TeamSwitcher teams={data.teams} />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain title="Platform" items={data.navMain} />
		<NavMain title="Admin" items={data.admin} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={data.user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
