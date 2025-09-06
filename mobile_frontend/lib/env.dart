import 'package:flutter_dotenv/flutter_dotenv.dart';

class Env {
  static String get baseUrl =>
      dotenv.env['BACKEND_BASE_URL']?.replaceAll(RegExp(r'/+$'), '') ??
      'http://localhost:3000';

  static String get demoEmail =>
      dotenv.env['DEMO_EMAIL'] ?? 'demo@synergy.com';

  static String get demoPassword =>
      dotenv.env['DEMO_PASSWORD'] ?? 'password123';
}
