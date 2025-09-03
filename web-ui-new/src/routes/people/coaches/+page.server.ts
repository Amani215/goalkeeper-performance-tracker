export async function load() {
	const coaches = [
		{ id: 1, name: 'John Doe', profile_picture: '/images/john.jpg', admin: true },
		{ id: 2, name: 'Jane Smith', profile_picture: '/images/jane.jpg', admin: false }
	];
	return {
		coaches
	};
}
