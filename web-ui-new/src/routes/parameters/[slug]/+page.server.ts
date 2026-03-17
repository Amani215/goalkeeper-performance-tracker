import { parameters } from '../data';

export function load({ params }): { tabs: any } {
	const tabs = parameters.find((param) => param.slug === params.slug);
	return { tabs };
}
