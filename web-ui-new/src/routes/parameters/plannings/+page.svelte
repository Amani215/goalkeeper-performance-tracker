<script>
	import TabContent from '$lib/components/parameter-utils/tab-content.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';

	let { data } = $props();
</script>

<Tabs.Root value="types">
	<Tabs.List class="flex w-full flex-nowrap justify-start overflow-x-auto whitespace-nowrap">
		<Tabs.Trigger value="types">Planning Types</Tabs.Trigger>
		<Tabs.Trigger value="technical">Technical</Tabs.Trigger>
		<Tabs.Trigger value="physical">Physical</Tabs.Trigger>
		<Tabs.Trigger value="psychomotricity">Psychomotricity</Tabs.Trigger>
		<Tabs.Trigger value="tactical">Tactical</Tabs.Trigger>
	</Tabs.List>

	<Tabs.Content value="types">
		<TabContent items={data.types} />
	</Tabs.Content>
	<Tabs.Content value="technical">
		<TabContent items={data.technical} />
	</Tabs.Content>
	<Tabs.Content value="physical">
		<TabContent items={data.physical} />
	</Tabs.Content>
	<Tabs.Content value="psychomotricity">
		<TabContent items={data.psychomotricity} />
	</Tabs.Content>
	<Tabs.Content value="tactical">
		<TabContent items={data.tactical} />
	</Tabs.Content>
</Tabs.Root>
