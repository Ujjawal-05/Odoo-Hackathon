import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../data/api_client.dart';
import '../../state/app_state.dart';
import 'package:intl/intl.dart';
import 'package:go_router/go_router.dart';

class TaskEditorScreen extends StatefulWidget {
  final String projectId;
  const TaskEditorScreen({super.key, required this.projectId});

  @override
  State<TaskEditorScreen> createState() => _TaskEditorScreenState();
}

class _TaskEditorScreenState extends State<TaskEditorScreen> {
  final titleC = TextEditingController();
  final descC = TextEditingController();

  DateTime? due;
  String status = 'todo';
  String? assigneeId;

  late final ApiClient api;
  late Future<List<Map<String, dynamic>>> membersFuture;

  bool get isDone => status == 'done';

  @override
  void initState() {
    super.initState();
    api = ApiClient(token: context.read<AppState>().token);
    membersFuture = _loadMembers();
  }

  Future<List<Map<String, dynamic>>> _loadMembers() async {
    final list = await api.getProjectMembers(widget.projectId);
    // expect list of { userId, name, role } or similar; normalize to Map<String,dynamic>
    return list.cast<Map<String, dynamic>>();
  }

  Future<void> _save() async {
    // basic validation
    if (titleC.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Title is required')),
      );
      return;
    }

    await api.createTask(
      projectId: widget.projectId,
      title: titleC.text.trim(),
      description: descC.text.trim().isEmpty ? null : descC.text.trim(),
      assigneeId: assigneeId,
      status: status,
      dueDate: due?.toIso8601String(),
    );
    if (mounted) context.pop();
  }

  @override
  void dispose() {
    titleC.dispose();
    descC.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final df = DateFormat.yMMMd();
    return Scaffold(
      appBar: AppBar(title: const Text('New Task')),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextField(
              controller: titleC,
              decoration: const InputDecoration(labelText: 'Title'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: descC,
              maxLines: 4,
              decoration: const InputDecoration(labelText: 'Description'),
            ),
            const SizedBox(height: 12),

            // Assignee picker
            FutureBuilder<List<Map<String, dynamic>>>(
              future: membersFuture,
              builder: (context, snap) {
                if (snap.connectionState == ConnectionState.waiting) {
                  return const ListTile(
                    title: Text('Loading members...'),
                    trailing: SizedBox(
                      height: 20, width: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    ),
                  );
                }
                if (snap.hasError) {
                  return const ListTile(
                    title: Text('Could not load members'),
                    subtitle: Text('You can still save and assign later.'),
                  );
                }
                final members = snap.data ?? const [];
                return DropdownButtonFormField<String>(
                  value: assigneeId,
                  items: [
                    const DropdownMenuItem<String>(
                      value: null,
                      child: Text('Unassigned'),
                    ),
                    ...members.map((m) {
                      final id = (m['userId'] ?? m['id'] ?? '').toString();
                      final name = (m['name'] ?? m['email'] ?? 'Member').toString();
                      return DropdownMenuItem<String>(
                        value: id.isEmpty ? null : id,
                        child: Text(name),
                      );
                    }),
                  ],
                  onChanged: (v) => setState(() => assigneeId = v),
                  decoration: const InputDecoration(labelText: 'Assignee'),
                );
              },
            ),

            const SizedBox(height: 12),

            // Status picker (still available)
            DropdownButtonFormField<String>(
              value: status,
              items: const [
                DropdownMenuItem(value: 'todo', child: Text('To-Do')),
                DropdownMenuItem(value: 'in_progress', child: Text('In Progress')),
                DropdownMenuItem(value: 'done', child: Text('Done')),
              ],
              onChanged: (v) => setState(() => status = v ?? 'todo'),
              decoration: const InputDecoration(labelText: 'Status'),
            ),

            // Quick “completed” toggle (sets status=done)
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Mark as completed'),
              value: isDone,
              onChanged: (v) => setState(() => status = v ? 'done' : 'todo'),
            ),

            const SizedBox(height: 12),

            // Due date
            ListTile(
              contentPadding: EdgeInsets.zero,
              title: Text(due == null ? 'Pick due date' : 'Due: ${df.format(due!)}'),
              trailing: const Icon(Icons.event),
              onTap: () async {
                final now = DateTime.now();
                final picked = await showDatePicker(
                  context: context,
                  firstDate: now.subtract(const Duration(days: 1)),
                  lastDate: now.add(const Duration(days: 365 * 2)),
                  initialDate: due ?? now,
                );
                if (picked != null) setState(() => due = picked);
              },
            ),

            const SizedBox(height: 12),
            SizedBox(
              height: 52,
              child: FilledButton(
                onPressed: _save,
                child: const Text('Save'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
