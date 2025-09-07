<script>
	import TabContent from '$lib/components/parameter-utils/tab-content.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';

	let { data } = $props();
</script>

<Tabs.Root value="teams" class="w-full">
	<Tabs.List class="flex w-full flex-nowrap justify-start overflow-x-auto whitespace-nowrap">
		<Tabs.Trigger value="teams">Teams</Tabs.Trigger>
		<Tabs.Trigger value="categories">Category names</Tabs.Trigger>
		<Tabs.Trigger value="seasons">Seasons</Tabs.Trigger>
		<Tabs.Trigger value="calendar-types">Calendar types</Tabs.Trigger>
		<Tabs.Trigger value="attendance">Attendance</Tabs.Trigger>
	</Tabs.List>

	<Tabs.Content value="teams">
		<TabContent items={data.teams} />
	</Tabs.Content>
	<Tabs.Content value="categories">
		<TabContent items={data.categories} />
	</Tabs.Content>
	<Tabs.Content value="seasons">
		<TabContent items={data.seasons} />
	</Tabs.Content>
	<Tabs.Content value="calendar-types">
		<TabContent items={data.calendarTypes} />
	</Tabs.Content>
	<Tabs.Content value="attendance">
		<TabContent items={data.attendance} />
	</Tabs.Content>
</Tabs.Root>
