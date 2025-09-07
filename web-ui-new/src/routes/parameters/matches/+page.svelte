<script>
	import TabContent from '$lib/components/parameter-utils/tab-content.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';

	let { data } = $props();
</script>

<Tabs.Root value="types">
	<Tabs.List class="flex w-full flex-nowrap justify-start overflow-x-auto whitespace-nowrap">
		<Tabs.Trigger value="types">Match types</Tabs.Trigger>
		<Tabs.Trigger value="places">Places</Tabs.Trigger>
		<Tabs.Trigger value="action-types">Action types</Tabs.Trigger>
		<Tabs.Trigger value="reaction-types">Reaction types</Tabs.Trigger>
		<Tabs.Trigger value="action-results">Action results</Tabs.Trigger>
	</Tabs.List>

	<Tabs.Content value="types">
		<TabContent items={data.types} />
	</Tabs.Content>
	<Tabs.Content value="places">
		<TabContent items={data.places} />
	</Tabs.Content>
	<Tabs.Content value="action-types">
		<TabContent items={data.actionTypes} />
	</Tabs.Content>
	<Tabs.Content value="reaction-types">
		<TabContent items={data.reactionTypes} />
	</Tabs.Content>
	<Tabs.Content value="action-results">
		<TabContent items={data.actionResults} />
	</Tabs.Content>
</Tabs.Root>
