export async function load() {
	const teams = ['EST', 'CA', 'ASM'];

	const categories = ['Seniors', 'Juniors', 'Cadets A', 'Cadets B', 'Minimes A', 'Minimes B'];

	const seasons = [['2023-2024', '2024-2025']];

	const calendarTypes = ['Play-off', 'Championnat', 'Super Play-off', 'Coupe de la ligue'];

	const attendance = [
		'Present',
		'With national team',
		'With seniors',
		'Absent',
		'Dismissed',
		'Hurt'
	];

	return { teams, categories, seasons, calendarTypes, attendance };
}
