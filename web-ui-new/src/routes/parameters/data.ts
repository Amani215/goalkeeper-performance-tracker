export const parameters: Array<{
	slug: string;
	name: string;
	tabs: Array<{
		value: string;
		label: string;
		items: Array<string>;
	}>;
}> = [
	{
		slug: 'general',
		name: 'General',
		tabs: [
			{ value: 'teams', label: 'Teams', items: ['EST', 'CA', 'ASM'] },
			{
				value: 'categories',
				label: 'Categories',
				items: ['Seniors', 'Juniors', 'Cadets A', 'Cadets B', 'Minimes A', 'Minimes B']
			},
			{ value: 'seasons', label: 'Seasons', items: ['2023-2024', '2024-2025'] },
			{
				value: 'calendarTypes',
				label: 'Calendar Types',
				items: ['Play-off', 'Championnat', 'Super Play-off', 'Coupe de la ligue']
			},
			{
				value: 'attendance',
				label: 'Attendance',
				items: ['Present', 'With national team', 'With seniors', 'Absent', 'Dismissed', 'Hurt']
			}
		]
	},
	{
		slug: 'matches',
		name: 'Matches',
		tabs: [
			{ value: 'types', label: 'Match Types', items: ['Tournament', 'Friendly', 'Training'] },
			{ value: 'places', label: 'Places', items: ['Jerba', 'Sousse', 'Tunis'] },
			{
				value: 'actionTypes',
				label: 'Action Types',
				items: [
					'Ballon en profondeur (Vitesse : Démarrage / Réaction)',
					'Passe en retrait',
					'Tir',
					'Centrage',
					'Coup De Pied De Réparation',
					'Remise Partenaire sous pression (Jeu aux pied)',
					'Coup De Tête',
					'Duel',
					'Offensif'
				]
			},
			{
				value: 'reactionTypes',
				label: 'Reaction Types',
				items: [
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
				]
			},
			{
				value: 'actionResults',
				label: 'Action Results',
				items: ['Réussie', 'Non réussie', 'Rien à lui reprocher', 'Passif']
			}
		]
	},
	{
		slug: 'plannings',
		name: 'Plannings',
		tabs: [
			{
				value: 'types',
				label: 'Planning Types',
				items: [
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
				]
			},
			{
				value: 'technical',
				label: 'Technical',
				items: [
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
				]
			},
			{
				value: 'physical',
				label: 'Physical',
				items: [
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
				]
			},
			{
				value: 'psychomotricity',
				label: 'Psychomotricity',
				items: [
					'Equilibre',
					'Differenciation',
					'Dissociation',
					'Rythme',
					'W Cognitif',
					'Orientation',
					'Reaction'
				]
			},
			{
				value: 'tactical',
				label: 'Tactical',
				items: [
					'Les Balles Strategiques',
					'Placement / Replacement',
					'Conservation',
					"Fermeture d'angle",
					'Transition'
				]
			}
		]
	}
];
