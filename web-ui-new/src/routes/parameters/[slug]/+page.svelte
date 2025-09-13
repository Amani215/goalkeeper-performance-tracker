<script>
	import TabContent from '$lib/components/parameter-utils/tab-content.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';

	let { data } = $props();
</script>

<Tabs.Root value={data.tabs?.tabs[0].value} class="w-full">
	<Tabs.List class="flex w-full flex-nowrap justify-start overflow-x-auto whitespace-nowrap">
		{#each data.tabs?.tabs as tab}
			<Tabs.Trigger value={tab.value}>{tab.label}</Tabs.Trigger>
		{/each}
	</Tabs.List>

	{#each data.tabs?.tabs as tab}
		<Tabs.Content value={tab.value}>
			<TabContent items={tab.items} />
		</Tabs.Content>
	{/each}
</Tabs.Root>
