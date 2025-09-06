import 'package:go_router/go_router.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/signup_screen.dart';
import 'screens/dashboard/project_list_screen.dart';
import 'screens/dashboard/project_detail_screen.dart';
import 'screens/dashboard/task_editor_screen.dart';
import 'screens/dashboard/discussion_screen.dart';
import 'screens/settings/settings_screen.dart';

final router = GoRouter(
  initialLocation: '/login',
  routes: [
    GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
    GoRoute(path: '/signup', builder: (_, __) => const SignupScreen()),
    GoRoute(path: '/projects', builder: (_, __) => const ProjectListScreen()),
    GoRoute(
      path: '/projects/:id',
      builder: (ctx, st) => ProjectDetailScreen(projectId: st.pathParameters['id']!),
    ),
    GoRoute(
      path: '/projects/:id/task/new',
      builder: (ctx, st) => TaskEditorScreen(projectId: st.pathParameters['id']!),
    ),
    GoRoute(
      path: '/settings',
      builder: (_, __) => const SettingsScreen(),
    ),
    GoRoute(
  path: '/projects/:id/discussion',
  builder: (ctx, st) => DiscussionScreen(projectId: st.pathParameters['id']!),
),
  ],
);
