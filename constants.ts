import { Achievement, AchievementType, Category } from './types';

export const ACHIEVEMENTS: Achievement[] = [
  // --- ROOT ---
  {
    id: 'nus_start',
    title: 'Welcome to NUS',
    description: 'Matriculate into the National University of Singapore.',
    iconName: 'MapPin',
    type: AchievementType.ROOT,
    category: Category.GENERAL,
    globalCompletionRate: 100,
    xp: 0
  },

  // --- ACADEMIC BRANCH ---
  {
    id: 'first_lecture',
    parentId: 'nus_start',
    title: 'Taking Notes',
    description: 'Attend your first lecture without falling asleep.',
    iconName: 'BookOpen',
    type: AchievementType.TASK,
    category: Category.ACADEMIC,
    globalCompletionRate: 95,
    xp: 10
  },
  {
    id: 'study_session',
    parentId: 'first_lecture',
    title: 'Library Dweller',
    description: 'Complete a continuous 10-hour study session in Central Library.',
    iconName: 'Clock',
    type: AchievementType.GOAL,
    category: Category.ACADEMIC,
    globalCompletionRate: 15,
    xp: 50
  },
  {
    id: 'deans_list',
    parentId: 'study_session',
    title: 'Top of the Class',
    description: 'Get on the Dean\'s List for a semester.',
    iconName: 'Trophy',
    type: AchievementType.CHALLENGE,
    category: Category.ACADEMIC,
    globalCompletionRate: 5,
    xp: 100
  },

  // --- EXPLORATION BRANCH ---
  {
    id: 'utown_visit',
    parentId: 'nus_start',
    title: 'Concrete Jungle',
    description: 'Visit University Town (UTown) for the first time.',
    iconName: 'Building',
    type: AchievementType.TASK,
    category: Category.EXPLORATION,
    globalCompletionRate: 98,
    xp: 10
  },
  {
    id: 'all_faculties',
    parentId: 'utown_visit',
    title: 'The Tourist',
    description: 'Visit every single faculty campus (FASS, FOE, SOC, Science, etc.).',
    iconName: 'Compass',
    type: AchievementType.GOAL,
    category: Category.EXPLORATION,
    globalCompletionRate: 30,
    xp: 50
  },
  {
    id: 'bus_master',
    parentId: 'all_faculties',
    title: 'Bus Captain',
    description: 'Take every internal shuttle bus route (A1, A2, D1, D2, K, E, BTC) at least once.',
    iconName: 'Bus',
    type: AchievementType.GOAL,
    category: Category.EXPLORATION,
    globalCompletionRate: 12,
    xp: 75
  },
  {
    id: 'marathon',
    parentId: 'bus_master',
    title: 'Iron Legs',
    description: 'Run a full marathon distance accumulatively around the school campus.',
    iconName: 'Footprints',
    type: AchievementType.CHALLENGE,
    category: Category.EXPLORATION,
    globalCompletionRate: 2,
    xp: 150
  },

  // --- SOCIAL BRANCH ---
  {
    id: 'orientation',
    parentId: 'nus_start',
    title: 'Ice Breaker',
    description: 'Participate in a freshman orientation camp.',
    iconName: 'Tent',
    type: AchievementType.TASK,
    category: Category.SOCIAL,
    globalCompletionRate: 80,
    xp: 20
  },
  {
    id: 'cc_activity',
    parentId: 'orientation',
    title: 'Extra Curricular',
    description: 'Join a CCA or Student Club.',
    iconName: 'Users',
    type: AchievementType.TASK,
    category: Category.SOCIAL,
    globalCompletionRate: 60,
    xp: 30
  },
  {
    id: 'networker',
    parentId: 'cc_activity',
    title: 'Mr. Worldwide',
    description: 'Make friends with at least one person from every faculty.',
    iconName: 'Globe',
    type: AchievementType.CHALLENGE,
    category: Category.SOCIAL,
    globalCompletionRate: 1,
    xp: 200
  }
];
