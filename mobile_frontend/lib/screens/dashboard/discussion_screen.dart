import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../data/api_client.dart';
import '../../state/app_state.dart';
import '../../ui/snack.dart';

class DiscussionScreen extends StatefulWidget {
  final String projectId;
  const DiscussionScreen({super.key, required this.projectId});

  @override
  State<DiscussionScreen> createState() => _DiscussionScreenState();
}

class _DiscussionScreenState extends State<DiscussionScreen> {
  late ApiClient api;
  late Future<List<dynamic>> future;
  final msgC = TextEditingController();

  @override
  void initState() {
    super.initState();
    final token = context.read<AppState>().token;
    api = ApiClient(token: token);
    future = api.getMessages(widget.projectId);
  }

  Future<void> _reload() async {
    setState(() {
      future = api.getMessages(widget.projectId);
    });
  }

  Future<void> _sendMessage() async {
    if (msgC.text.trim().isEmpty) return;
    try {
      await api.postMessage(
        projectId: widget.projectId,
        text: msgC.text.trim(),
      );
      msgC.clear();
      await _reload();
      if (mounted) showOkSnack(context, 'Message sent');
    } catch (_) {
      if (mounted) showErrorSnack(context, 'Failed to send message');
    }
  }

  @override
  void dispose() {
    msgC.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Discussion')),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: FutureBuilder<List<dynamic>>(
                future: future,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator.adaptive());
                  }
                  if (snapshot.hasError) {
                    return Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.wifi_off, size: 64, color: Colors.grey),
                          const SizedBox(height: 8),
                          const Text('Could not load messages'),
                          const SizedBox(height: 8),
                          FilledButton.icon(
                            onPressed: _reload,
                            icon: const Icon(Icons.refresh),
                            label: const Text('Retry'),
                          ),
                        ],
                      ),
                    );
                  }
                  final msgs = (snapshot.data ?? []).cast<Map<String, dynamic>>();
                  if (msgs.isEmpty) {
                    return const Center(
                      child: Text('No messages yet. Start the discussion!'),
                    );
                  }
                  return ListView.separated(
                    padding: const EdgeInsets.all(12),
                    itemCount: msgs.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 8),
                    itemBuilder: (_, i) {
                      final m = msgs[i];
                      return Card(
                        child: ListTile(
                          leading: const CircleAvatar(child: Icon(Icons.person)),
                          title: Text(m['author'] ?? 'Unknown'),
                          subtitle: Text(m['text'] ?? ''),
                        ),
                      );
                    },
                  );
                },
              ),
            ),
            const Divider(height: 1),
            Padding(
              padding: const EdgeInsets.all(8),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: msgC,
                      minLines: 1,
                      maxLines: 4,
                      decoration: const InputDecoration(
                        hintText: 'Write a message...',
                        border: OutlineInputBorder(),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton(
                    icon: const Icon(Icons.send),
                    onPressed: _sendMessage,
                    color: Theme.of(context).colorScheme.primary,
                  )
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
