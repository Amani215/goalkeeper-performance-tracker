<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLFormAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLFormAttributes> = $props();

	const id = $props.id();
</script>

<form class={cn('flex flex-col gap-6', className)} bind:this={ref} {...restProps}>
	<div class="flex flex-col items-center gap-2 text-center">
		<h1 class="text-2xl font-bold">Login to your account</h1>
		<p class="text-muted-foreground text-balance text-sm">
			Enter your username below to login to your account
		</p>
	</div>
	<div class="grid gap-6">
		<div class="grid gap-3">
			<Label for="email-{id}">Username</Label>
			<Input id="email-{id}" type="text" placeholder="John Doe" required />
		</div>
		<div class="grid gap-3">
			<div class="flex items-center">
				<Label for="password-{id}">Password</Label>
				<a href="##" class="ml-auto text-sm underline-offset-4 hover:underline">
					Forgot your password?
				</a>
			</div>
			<Input id="password-{id}" type="password" required />
		</div>
		<Button type="submit" class="w-full">Login</Button>
		<div class="text-center text-sm">
			Don&apos;t have an account?
			<a href="##" class="underline underline-offset-4"> Read more here </a>
		</div>
	</div>
</form>
