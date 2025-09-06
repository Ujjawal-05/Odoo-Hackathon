import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../data/api_client.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});
  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final nameC = TextEditingController();
  final emailC = TextEditingController();
  final passC = TextEditingController();
  bool loading = false;
  String? msg;

  Future<void> _signup() async {
    setState(() { loading = true; msg = null; });
    try {
      final api = ApiClient();
      await api.register(nameC.text.trim(), emailC.text.trim(), passC.text);
      setState(() => msg = 'Account created! You can log in now.');
    } catch (_) {
      setState(() => msg = 'Signup failed. Try again.');
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final spacing = 16.0;
    return Scaffold(
      appBar: AppBar(title: const Text('Create account')),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextField(controller: nameC, decoration: const InputDecoration(labelText: 'Name')),
            SizedBox(height: spacing),
            TextField(controller: emailC, decoration: const InputDecoration(labelText: 'Email')),
            SizedBox(height: spacing),
            TextField(controller: passC, decoration: const InputDecoration(labelText: 'Password'), obscureText: true),
            const SizedBox(height: 24),
            SizedBox(
              height: 52,
              child: FilledButton(
                onPressed: loading ? null : _signup,
                child: loading ? const CircularProgressIndicator.adaptive() : const Text('Sign up'),
              ),
            ),
            if (msg != null) ...[
              const SizedBox(height: 12),
              Text(msg!),
            ],
            TextButton(onPressed: () => context.go('/login'), child: const Text('Back to login')),
          ],
        ),
      ),
    );
  }
}
