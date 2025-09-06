class Project {
  final String id;
  final String name;
  final String? description;

  Project({required this.id, required this.name, this.description});

  factory Project.fromMap(Map<String, dynamic> m) =>
      Project(id: m['id'], name: m['name'], description: m['description']);
}

class TaskItem {
  final String id;
  final String title;
  final String status; // todo | in_progress | done
  final String? assigneeName;
  final DateTime? due;

  TaskItem({
    required this.id,
    required this.title,
    required this.status,
    this.assigneeName,
    this.due,
  });

  factory TaskItem.fromMap(Map<String, dynamic> m) => TaskItem(
    id: m['id'],
    title: m['title'],
    status: m['status'],
    assigneeName: m['assigneeName'],
    due: m['dueDate'] != null ? DateTime.tryParse(m['dueDate']) : null,
  );
}
