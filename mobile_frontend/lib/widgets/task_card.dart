import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class TaskCard extends StatelessWidget {
  final Map<String, dynamic> task;
  const TaskCard({super.key, required this.task});

  @override
  Widget build(BuildContext context) {
    final due = task['dueDate'] != null ? DateTime.tryParse(task['dueDate']) : null;
    final df = DateFormat.MMMd();
    return Semantics(
      label: 'Task: ${task['title'] ?? 'Untitled'}',
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              const Icon(Icons.task_alt),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(task['title'] ?? 'Untitled',
                      style: Theme.of(context).textTheme.titleMedium,
                      maxLines: 2, overflow: TextOverflow.ellipsis),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        if (task['assigneeName'] != null)
                          Padding(
                            padding: const EdgeInsets.only(right: 8),
                            child: Chip(label: Text(task['assigneeName'])),
                          ),
                        if (due != null)
                          Row(children: [
                            const Icon(Icons.event, size: 16),
                            const SizedBox(width: 4),
                            Text(df.format(due)),
                          ]),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Icon(
                switch (task['status']) {
                  'done' => Icons.check_circle,
                  'in_progress' => Icons.timelapse,
                  _ => Icons.radio_button_unchecked,
                },
                color: Theme.of(context).colorScheme.primary,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
