export async function load() {
	const types = [
		'Salle de Musculation',
		'Application',
		'Match Officiel',
		'Decrassage',
		'Opposition',
		'Deplacement',
		'Seance Annulee',
		'Repos',
		'Entrainement',
		'Match Amical'
	];

	const technical = [
		'Trav. Combine (Plongeon/Detente)',
		'Duel Angle (Tir)',
		'Claquettes',
		'Technique la Croix',
		'Trav. Combine (Jeu au Pieds + Chute)',
		'Jeu au Pieds',
		'Duel Angle (Drible)',
		'Chute Avant Avec Boxing',
		'Relance Main/Pied',
		'Relance Pied',
		'Detente et Prise de Balle',
		'Trav. Combine (Jeu au Pieds/ Prise de Balle Aerienne/ Chute)',
		'Trav. Combine (Jeu au Pieds + Prise de Balle Aerienne)',
		'Relance Main'
	];

	const physical = [
		'Renforcement Memb. Sup.',
		'Fartlek',
		'Salle de Musculation',
		'Pliometrie',
		'Force Vitesse',
		'Renforcement Menb. Inf. et Sup.',
		'Intermittent (CREI) 5/25',
		'Decrassage',
		'Force',
		'Renforcement Menb. Inf.',
		'Stato-dynamique',
		'Vitesse de Reaction',
		'Vivacite et Reactivite',
		'Vitesse de Demarrage'
	];

	const psychomotricity = [
		'Equilibre',
		'Differenciation',
		'Dissociation',
		'Rythme',
		'W Cognitif',
		'Orientation',
		'Reaction'
	];

	const tactical = [
		'Les Balles Strategiques',
		'Placement / Replacement',
		'Conservation',
		"Fermeture d'angle",
		'Transition'
	];

	return {
		types,
		technical,
		physical,
		psychomotricity,
		tactical
	};
}
