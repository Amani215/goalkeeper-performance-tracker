export async function load() {
	const admins = [
		{ id: 1, name: 'Admin Uno', profile_picture: '/images/john.jpg', admin: true },
		{ id: 2, name: 'Admin Dos', profile_picture: '/images/jane.jpg', admin: true }
	];
	return {
		admins
	};
}
