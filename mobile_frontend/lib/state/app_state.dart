import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AppState extends ChangeNotifier {
  // --- Theme ---
  ThemeMode _themeMode = ThemeMode.system;
  ThemeMode get themeMode => _themeMode;

  // --- Auth / Profile ---
  String? _token;
  String? _userRole;       // 'admin' | 'manager' | 'user'
  String? _userId;         // optional
  String? _userName;       // optional
  String? _userEmail;      // optional

  String? get token => _token;
  String? get userRole => _userRole;
  String? get userId => _userId;
  String? get userName => _userName;
  String? get userEmail => _userEmail;

  bool get isAuthed => (_token != null && _token!.isNotEmpty);
  bool get isAdmin  => (userRole?.toLowerCase() == 'admin');

  // --- Keys ---
  static const _kTheme = 'themeMode';
  static const _kToken = 'token';
  static const _kRole  = 'userRole';
  static const _kUid   = 'userId';
  static const _kName  = 'userName';
  static const _kEmail = 'userEmail';

  Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    final themeIndex = prefs.getInt(_kTheme);
    if (themeIndex != null) _themeMode = ThemeMode.values[themeIndex];

    _token     = prefs.getString(_kToken);
    _userRole  = prefs.getString(_kRole);
    _userId    = prefs.getString(_kUid);
    _userName  = prefs.getString(_kName);
    _userEmail = prefs.getString(_kEmail);

    notifyListeners();
  }

  Future<void> setThemeMode(ThemeMode mode) async {
    _themeMode = mode;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(_kTheme, mode.index);
    notifyListeners();
  }

  Future<void> setToken(String? token) async {
    _token = token;
    final prefs = await SharedPreferences.getInstance();
    if (token == null) {
      await prefs.remove(_kToken);
      // also clear user info if logging out
      await prefs.remove(_kRole);
      await prefs.remove(_kUid);
      await prefs.remove(_kName);
      await prefs.remove(_kEmail);
      _userRole = _userId = _userName = _userEmail = null;
    } else {
      await prefs.setString(_kToken, token);
    }
    notifyListeners();
  }

  Future<void> setUserRole(String? role) async {
    _userRole = role;
    final prefs = await SharedPreferences.getInstance();
    if (role == null) {
      await prefs.remove(_kRole);
    } else {
      await prefs.setString(_kRole, role);
    }
    notifyListeners();
  }

  Future<void> setProfile({
    String? id,
    String? name,
    String? email,
    String? role, // optional convenience
  }) async {
    _userId = id ?? _userId;
    _userName = name ?? _userName;
    _userEmail = email ?? _userEmail;
    if (role != null) _userRole = role;

    final prefs = await SharedPreferences.getInstance();
    if (id != null)    await prefs.setString(_kUid, id);
    if (name != null)  await prefs.setString(_kName, name);
    if (email != null) await prefs.setString(_kEmail, email);
    if (role != null)  await prefs.setString(_kRole, role);

    notifyListeners();
  }

  Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_kToken);
    await prefs.remove(_kRole);
    await prefs.remove(_kUid);
    await prefs.remove(_kName);
    await prefs.remove(_kEmail);

    _token = null;
    _userRole = null;
    _userId = null;
    _userName = null;
    _userEmail = null;
    notifyListeners();
  }
}
