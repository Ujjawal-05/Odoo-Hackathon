import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../data/api_client.dart';
import '../../state/app_state.dart';
import 'package:provider/provider.dart';
import '../../widgets/task_card.dart';

class ProjectDetailScreen extends StatefulWidget {
  final String projectId;
  const ProjectDetailScreen({super.key, required this.projectId});

  @override
  State<ProjectDetailScreen> createState() => _ProjectDetailScreenState();
}

class _ProjectDetailScreenState extends State<ProjectDetailScreen> with TickerProviderStateMixin {
  late ApiClient api;
  late TabController tab;
  Future<List<dynamic>>? futureTasks;
  Future<List<dynamic>>? futureMsgs;

  @override
  void initState() {
    super.initState();
    final token = context.read<AppState>().token;
    api = ApiClient(token: token);
    tab = TabController(length: 2, vsync: this);
    _reload();
  }

  void _reload() {
    setState(() {
      futureTasks = api.getProjectTasks(widget.projectId);
      futureMsgs  = api.getMessages(widget.projectId);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Project'),
        bottom: TabBar(controller: tab, tabs: const [
          Tab(text: 'Board'),
          Tab(text: 'Discussion'),
        ]),
        actions: [
          IconButton(
            tooltip: 'Add task',
            onPressed: () => context.push('/projects/${widget.projectId}/task/new').then((_) => _reload()),
            icon: const Icon(Icons.add_task),
          ),
        ],
      ),
      body: TabBarView(
        controller: tab,
        children: [
          // --- Board (To-Do / In Progress / Done columns) ---
          FutureBuilder<List<dynamic>>(
            future: futureTasks,
            builder: (context, snap) {
              if (snap.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator.adaptive());
              }
              final tasks = (snap.data ?? []).cast<Map<String, dynamic>>();
              List<Map<String, dynamic>> col(String s) => tasks.where((t) => t['status'] == s).toList();

              Widget column(String title, String status) {
                final items = col(status);
                return Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(title, style: Theme.of(context).textTheme.titleLarge),
                      const SizedBox(height: 8),
                      Expanded(
                        child: items.isEmpty
                          ? Container(
                              alignment: Alignment.center,
                              decoration: BoxDecoration(
                                border: Border.all(color: Theme.of(context).dividerColor),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Text('No tasks'),
                            )
                          : ListView.separated(
                              itemCount: items.length,
                              separatorBuilder: (_, __) => const SizedBox(height: 8),
                              itemBuilder: (_, i) => TaskCard(task: items[i]),
                            ),
                      ),
                    ],
                  ),
                );
              }

              return LayoutBuilder(
                builder: (context, c) {
                  final narrow = c.maxWidth < 700;
                  if (narrow) {
                    // stacked lists on mobile
                    return ListView(
                      children: [
                        SizedBox(height: 8),
                        SizedBox(height: 320, child: column('To-Do', 'todo')),
                        SizedBox(height: 320, child: column('In Progress', 'in_progress')),
                        SizedBox(height: 320, child: column('Done', 'done')),
                      ],
                    );
                  }
                  // 3-column board on wide
                  return Row(
                    children: [
                      Expanded(child: column('To-Do', 'todo')),
                      Expanded(child: column('In Progress', 'in_progress')),
                      Expanded(child: column('Done', 'done')),
                    ],
                  );
                },
              );
            },
          ),

          // --- Discussion (threaded) ---
          FutureBuilder<List<dynamic>>(
            future: futureMsgs,
            builder: (context, snap) {
              if (snap.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator.adaptive());
              }
              final msgs = (snap.data ?? []).cast<Map<String, dynamic>>();
              return _DiscussionList(projectId: widget.projectId, messages: msgs, onPosted: _reload);
            },
          ),
        ],
      ),
    );
  }
}

class _DiscussionList extends StatefulWidget {
  final String projectId;
  final List<Map<String, dynamic>> messages;
  final VoidCallback onPosted;
  const _DiscussionList({required this.projectId, required this.messages, required this.onPosted});

  @override
  State<_DiscussionList> createState() => _DiscussionListState();
}

class _DiscussionListState extends State<_DiscussionList> {
  final c = TextEditingController();

  @override
  void dispose() {
    c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final root = widget.messages.where((m) => m['parentId'] == null).toList();
    final childrenOf = (String id) => widget.messages.where((m) => m['parentId'] == id).toList();

    return Column(
      children: [
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(12),
            itemCount: root.length,
            itemBuilder: (_, i) {
              final m = root[i];
              final childrenOf = (String id) =>
    widget.messages.where((m) => "${m['parentId']}" == id).toList();

final kids = childrenOf("${m['id']}");

              return Card(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(m['author'] ?? 'Member', style: Theme.of(context).textTheme.labelLarge),
                      const SizedBox(height: 4),
                      Text(m['text'] ?? ''),
                      const SizedBox(height: 8),
                      ...kids.map((k) => Padding(
                        padding: const EdgeInsets.only(left: 12, top: 8),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Icon(Icons.subdirectory_arrow_right, size: 18),
                            const SizedBox(width: 6),
                            Expanded(child: Text(k['text'] ?? '')),
                          ],
                        ),
                      )),
                      Align(
                        alignment: Alignment.centerRight,
                        child: TextButton.icon(
                          icon: const Icon(Icons.reply),
                          label: const Text('Reply'),
                          onPressed: () async {
                            final replyC = TextEditingController();
                            final ok = await showDialog<bool>(
                              context: context,
                              builder: (_) => AlertDialog(
                                title: const Text('Reply'),
                                content: TextField(controller: replyC, maxLines: 3),
                                actions: [
                                  TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
                                  FilledButton(onPressed: () => Navigator.pop(context, true), child: const Text('Send')),
                                ],
                              ),
                            );
                            if (ok == true && replyC.text.trim().isNotEmpty) {
                              final api = ApiClient(token: context.read<AppState>().token);
                              await api.postMessage(projectId: widget.projectId, parentId: m['id'], text: replyC.text.trim());
                              widget.onPosted();
                            }
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
        const Divider(height: 1),
        Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: c,
                  maxLines: 3,
                  minLines: 1,
                  decoration: const InputDecoration(hintText: 'Write a message…'),
                ),
              ),
              const SizedBox(width: 8),
              Semantics(
                button: true, label: 'Send message',
                child: FilledButton.icon(
                  icon: const Icon(Icons.send),
                  onPressed: () async {
                    if (c.text.trim().isEmpty) return;
                    final api = ApiClient(token: context.read<AppState>().token);
                    await api.postMessage(projectId: widget.projectId, text: c.text.trim());
                    c.clear();
                    widget.onPosted();
                  },
                  label: const Text('Send'),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
