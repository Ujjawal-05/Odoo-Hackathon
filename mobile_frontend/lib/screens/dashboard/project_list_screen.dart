import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../data/api_client.dart';
import '../../state/app_state.dart';
import '../../ui/snack.dart';

class ProjectListScreen extends StatefulWidget {
  const ProjectListScreen({super.key});
  @override
  State<ProjectListScreen> createState() => _ProjectListScreenState();
}

class _ProjectListScreenState extends State<ProjectListScreen> {
  late ApiClient api;
  Future<List<dynamic>>? future;
  List<Map<String, dynamic>> _all = [];
  List<Map<String, dynamic>> _filtered = [];
  final _searchC = TextEditingController();
  bool _loadingAction = false;

  @override
  void initState() {
    super.initState();
    final token = context.read<AppState>().token;
    api = ApiClient(token: token);
    future = _fetch();
    _searchC.addListener(_applyFilter);
  }

  @override
  void dispose() {
    _searchC.removeListener(_applyFilter);
    _searchC.dispose();
    super.dispose();
  }

  Future<List<dynamic>> _fetch() async {
    try {
      final data = await api.getProjects();
      _all = data.cast<Map<String, dynamic>>();
      _applyFilter();
      return data;
    } catch (e) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) showErrorSnack(context, 'Could not load projects');
      });
      rethrow;
    }
  }

  void _applyFilter() {
    final q = _searchC.text.trim().toLowerCase();
    setState(() {
      _filtered = q.isEmpty
          ? _all
          : _all.where((p) {
              final n = (p['name'] ?? '').toString().toLowerCase();
              final d = (p['description'] ?? '').toString().toLowerCase();
              return n.contains(q) || d.contains(q);
            }).toList();
    });
  }

  Future<void> _createProject() async {
  final nameC = TextEditingController();
  final descC = TextEditingController();
  final ok = await showDialog<bool>(
    context: context,
    builder: (_) => AlertDialog(
      title: const Text('New Project'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          TextField(
            controller: nameC,
            decoration: const InputDecoration(labelText: 'Name'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: descC,
            decoration: const InputDecoration(labelText: 'Description'),
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context, false),
          child: const Text('Cancel'),
        ),
        FilledButton(
          onPressed: () => Navigator.pop(context, true),
          child: const Text('Create'),
        ),
      ],
    ),
  );

  if (ok == true) {
    setState(() => _loadingAction = true);
    try {
      final created = await api.createProject(
        nameC.text.trim(),
        descC.text.trim(),
      );

      if (created == null) {
        if (mounted) {
          // Special handling if backend said 403
          showErrorSnack(context, 'Not authorized to create a project');
        }
      } else {
        if (mounted) showOkSnack(context, 'Project created');
        await _refresh();
      }
    } catch (e) {
      if (mounted) showErrorSnack(context, 'Create project failed: $e');
    } finally {
      if (mounted) setState(() => _loadingAction = false);
    }
  }
}

  Future<void> _refresh() async {
    final newFuture = _fetch();
    setState(() {
      future = newFuture;
    });

    await future;
  }

  @override
  Widget build(BuildContext context) {
    final topBar = SliverAppBar(
      pinned: true,
      title: const Text('Projects'),
      actions: [
        IconButton(
          tooltip: 'Settings',
          onPressed: () => context.push('/settings'),
          icon: const Icon(Icons.settings_outlined),
        ),
      ],
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(64),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
          child: TextField(
            controller: _searchC,
            textInputAction: TextInputAction.search,
            decoration: InputDecoration(
              prefixIcon: const Icon(Icons.search),
              hintText: 'Search projects…',
              filled: true,
              border: const OutlineInputBorder(),
              contentPadding:
                  const EdgeInsets.symmetric(vertical: 0, horizontal: 12),
              suffixIcon: _searchC.text.isEmpty
                  ? null
                  : IconButton(
                      tooltip: 'Clear search',
                      onPressed: () {
                        _searchC.clear();
                        _applyFilter();
                      },
                      icon: const Icon(Icons.clear),
                    ),
            ),
          ),
        ),
      ),
    );

    return Scaffold(
      body: SafeArea(
        child: FutureBuilder<List<dynamic>>(
          future: future,
          builder: (context, snapshot) {
            // Loading
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const _LoadingSkeleton();
            }

            // Error
            if (snapshot.hasError) {
              return _ErrorState(
                onRetry: () {
                  final newFuture = _fetch();
                  setState(() {
                    future = newFuture;
                  });
                },
              );
            }

            // Loaded
            final list = _filtered;
            return RefreshIndicator.adaptive(
              onRefresh: _refresh,
              edgeOffset: 80,
              child: CustomScrollView(
                slivers: [
                  topBar,
                  if (list.isEmpty)
                    const SliverFillRemaining(
                      hasScrollBody: false,
                      child: _EmptyState(
                        title: 'No projects yet',
                        subtitle:
                            'Tap the + button to create your first project',
                        icon: Icons.folder_open,
                      ),
                    )
                  else
                    SliverPadding(
                      padding: const EdgeInsets.fromLTRB(12, 12, 12, 100),
                      sliver: SliverList.separated(
                        itemCount: list.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 12),
                        itemBuilder: (_, i) {
                          final p = list[i];
                          return _ProjectCard(
                            name: (p['name'] ?? 'Untitled').toString(),
                            description: (p['description'] ?? '').toString(),
                            onTap: () => context.push('/projects/${p['id']}'),
                          );
                        },
                      ),
                    ),
                ],
              ),
            );
          },
        ),
      ),
      floatingActionButton: Semantics(
        button: true,
        label: 'Create new project',
        child: FloatingActionButton.extended(
          onPressed: _loadingAction ? null : _createProject,
          icon: _loadingAction
              ? const SizedBox(
                  height: 18,
                  width: 18,
                  child: CircularProgressIndicator(strokeWidth: 2))
              : const Icon(Icons.add),
          label: Text(_loadingAction ? 'Creating…' : 'New'),
        ),
      ),
    );
  }
}

/* ----------------------------- Helper Widgets ----------------------------- */

class _ProjectCard extends StatelessWidget {
  final String name;
  final String description;
  final VoidCallback onTap;
  const _ProjectCard(
      {required this.name, required this.description, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Semantics(
      label: 'Project: $name',
      button: true,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Ink(
          decoration: BoxDecoration(
            color: cs.surface,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Theme.of(context).dividerColor),
          ),
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  height: 44,
                  width: 44,
                  decoration: BoxDecoration(
                    color: cs.primaryContainer,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(Icons.folder, color: cs.onPrimaryContainer),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(name,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: Theme.of(context)
                              .textTheme
                              .titleMedium
                              ?.copyWith(fontWeight: FontWeight.w600)),
                      const SizedBox(height: 4),
                      Text(
                        description.isEmpty
                            ? 'No description provided'
                            : description,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Icon(Icons.chevron_right, color: cs.outline),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  const _EmptyState(
      {required this.title, required this.subtitle, required this.icon});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(28),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 64, color: cs.outline),
            const SizedBox(height: 12),
            Text(title,
                style: Theme.of(context).textTheme.titleLarge,
                textAlign: TextAlign.center),
            const SizedBox(height: 6),
            Text(subtitle,
                style: Theme.of(context).textTheme.bodyMedium,
                textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }
}

class _ErrorState extends StatelessWidget {
  final VoidCallback onRetry;
  const _ErrorState({required this.onRetry});

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(28),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.wifi_off, size: 64, color: cs.error),
            const SizedBox(height: 12),
            Text('Failed to load projects',
                style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 6),
            Text('Please check your connection and try again.',
                style: Theme.of(context).textTheme.bodyMedium,
                textAlign: TextAlign.center),
            const SizedBox(height: 16),
            FilledButton.icon(
                onPressed: onRetry,
                icon: const Icon(Icons.refresh),
                label: const Text('Retry')),
          ],
        ),
      ),
    );
  }
}

class _LoadingSkeleton extends StatelessWidget {
  const _LoadingSkeleton();

  @override
  Widget build(BuildContext context) {
    Widget skel() => Container(
          height: 86,
          decoration: BoxDecoration(
            color: Theme.of(context)
                .colorScheme
                .surfaceContainerHighest
                .withOpacity(0.5),
            borderRadius: BorderRadius.circular(16),
          ),
        );

    return CustomScrollView(
      slivers: [
        const SliverAppBar(title: Text('Projects')),
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(12, 12, 12, 12),
          sliver: SliverList.separated(
            itemCount: 6,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (_, __) => skel(),
          ),
        ),
      ],
    );
  }
}
