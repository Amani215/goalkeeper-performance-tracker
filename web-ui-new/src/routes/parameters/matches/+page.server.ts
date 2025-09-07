export async function load() {
	const types = ['Tournament', 'Friendly', 'Training'];

	const places = ['Jerba', 'Sousse', 'Tunis'];

	const actionTypes = [
		'Ballon en profondeur (Vitesse : Démarrage / Réaction)',
		'Passe en retrait',
		'Tir',
		'Centrage',
		'Coup De Pied De Réparation',
		'Remise Partenaire sous pression (Jeu aux pied)',
		'Coup De Tête',
		'Duel',
		'Offensif'
	];

	const reactionTypes = [
		'Relance / Pied',
		'Chute De Face',
		'Claquette',
		'Chute Latérale Gauche',
		'Arrêt reflexe (Vitesse gestuelle)',
		'intervention sans parade et sans détente',
		'Sauvé avec le corps - tête - pieds',
		'Sortie Aérienne',
		'Ballon en profondeur',
		'Relance / Main',
		'Jeu aux Pied (Conservation)',
		'Chute Latérale Droite'
	];

	const actionResults = ['Réussie', 'Non réussie', 'Rien à lui reprocher', 'Passif'];

	return { types, places, actionTypes, reactionTypes, actionResults };
}
