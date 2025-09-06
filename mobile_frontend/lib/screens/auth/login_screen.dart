import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../data/api_client.dart';
import '../../state/app_state.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final emailC = TextEditingController();
  final passC = TextEditingController();
  bool loading = false;
  bool showPass = false;
  String? errorText;

  @override
  void dispose() {
    emailC.dispose();
    passC.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    // Validate fields first
    final ok = _formKey.currentState?.validate() ?? false;
    if (!ok) return;

    setState(() {
      loading = true;
      errorText = null;
    });

    try {
      final api = ApiClient();
      final res = await api.login(emailC.text.trim(), passC.text);

      if (res == null) {
        // non-200 or network error
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Login failed. Check credentials or network.')),
          );
          setState(() => errorText = 'Login failed. Check credentials.');
        }
        return;
      }

      final token = res['token'] as String?;
      if (token == null || token.isEmpty) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Login failed: no token returned')),
          );
          setState(() => errorText = 'Login failed: no token');
        }
        return;
      }

      await context.read<AppState>().setToken(token);
      if (mounted) context.go('/projects');
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
        setState(() => errorText = 'Login failed. Please try again.');
      }
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final spacing = 16.0;
    return Scaffold(
      appBar: AppBar(title: const Text('SynergySphere'), centerTitle: true),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const SizedBox(height: 24),
            Text('Welcome back', style: Theme.of(context).textTheme.headlineMedium),
            const SizedBox(height: 8),
            Text('Log in to continue', style: Theme.of(context).textTheme.bodyLarge),
            const SizedBox(height: 24),

            Form(
              key: _formKey,
              child: Column(
                children: [
                  TextFormField(
                    controller: emailC,
                    keyboardType: TextInputType.emailAddress,
                    autofillHints: const [AutofillHints.username, AutofillHints.email],
                    decoration: const InputDecoration(labelText: 'Email', hintText: 'you@company.com'),
                    validator: (v) {
                      final s = v?.trim() ?? '';
                      if (s.isEmpty) return 'Email is required';
                      // very light check
                      if (!s.contains('@') || !s.contains('.')) return 'Enter a valid email';
                      return null;
                    },
                    textInputAction: TextInputAction.next,
                  ),
                  SizedBox(height: spacing),
                  TextFormField(
                    controller: passC,
                    obscureText: !showPass,
                    autofillHints: const [AutofillHints.password],
                    decoration: InputDecoration(
                      labelText: 'Password',
                      hintText: '••••••••',
                      suffixIcon: IconButton(
                        tooltip: showPass ? 'Hide password' : 'Show password',
                        icon: Icon(showPass ? Icons.visibility_off : Icons.visibility),
                        onPressed: () => setState(() => showPass = !showPass),
                      ),
                    ),
                    validator: (v) => (v == null || v.isEmpty) ? 'Password is required' : null,
                    onFieldSubmitted: (_) => loading ? null : _login(),
                    textInputAction: TextInputAction.done,
                  ),
                ],
              ),
            ),

            if (errorText != null) ...[
              const SizedBox(height: 12),
              Text(
                errorText!,
                style: TextStyle(color: Theme.of(context).colorScheme.error),
              ),
            ],

            const SizedBox(height: 24),
            Semantics(
              button: true,
              label: 'Log in',
              child: SizedBox(
                height: 52,
                child: FilledButton(
                  onPressed: loading ? null : _login,
                  child: loading
                      ? const SizedBox(height: 22, width: 22, child: CircularProgressIndicator(strokeWidth: 2))
                      : const Text('Log in'),
                ),
              ),
            ),
            const SizedBox(height: 12),
            TextButton(
              onPressed: loading ? null : () => context.go('/signup'),
              child: const Text('Create an account'),
            ),
          ],
        ),
      ),
    );
  }
}
