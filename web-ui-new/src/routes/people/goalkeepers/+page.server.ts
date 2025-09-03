export async function load() {
	const goalkeepers = [
		{ id: 1, name: 'John Doe', profile_picture: '/images/john.jpg', age: 23 },
		{ id: 2, name: 'Jane Smith', profile_picture: '/images/jane.jpg', age: 25 }
	];
	return {
		goalkeepers
	};
}
