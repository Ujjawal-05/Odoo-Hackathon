import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../env.dart';

class ApiClient {
  ApiClient({String? token}) : _token = token;
  String? _token;

  void setToken(String? token) => _token = token;

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (_token != null) 'Authorization': 'Bearer $_token',
      };

  Uri _u(String path, [Map<String, dynamic>? query]) {
    final base = Env.baseUrl.replaceAll(RegExp(r'/+$'), ''); // e.g., http://10.0.2.2:3000
    final full = '$base/api/v1$path';
    return Uri.parse(full).replace(queryParameters: query);
  }

  /* --------------------------------- Auth -------------------------------- */
  Future<Map<String, dynamic>?> register(String name, String email, String password) async {
    try {
      final r = await http.post(_u('/auth/register'), headers: _headers, body: jsonEncode({'name': name, 'email': email, 'password': password}));
      if (r.statusCode == 201) return jsonDecode(r.body) as Map<String, dynamic>;
      debugPrint('register failed: ${r.statusCode} ${r.body}');
    } catch (e) {
      debugPrint('register ex: $e');
    }
    return null;
  }

  Future<Map<String, dynamic>?> login(String email, String password) async {
    try {
      final r = await http.post(_u('/auth/login'), headers: _headers, body: jsonEncode({'email': email, 'password': password}));
      if (r.statusCode == 200) return jsonDecode(r.body) as Map<String, dynamic>;
      debugPrint('login failed: ${r.statusCode} ${r.body}');
    } catch (e) {
      debugPrint('login ex: $e');
    }
    return null;
  }

  Future<void> logout() async {
    try { await http.post(_u('/auth/logout'), headers: _headers); } catch (_) {}
  }

  /* -------------------------------- Users -------------------------------- */
  Future<Map<String, dynamic>?> me() async {
    try {
      final r = await http.get(_u('/users/me'), headers: _headers);
      if (r.statusCode == 200) return jsonDecode(r.body) as Map<String, dynamic>;
    } catch (e) { debugPrint('me ex: $e'); }
    return null;
  }

  Future<List<dynamic>> getUsers() async {
  try {
    final r = await http.get(_u('/users'), headers: _headers);
    if (r.statusCode == 200) {
      return jsonDecode(r.body) as List<dynamic>;
    }
  } catch (e) {
    debugPrint('getUsers failed: $e');
  }
  return [];
}


  /* ------------------------------- Projects ------------------------------ */
  Future<List<dynamic>> getProjects({int? limit, String? cursor}) async {
    try {
      final r = await http.get(_u('/projects', {
        if (limit != null) 'limit': '$limit',
        if (cursor != null) 'cursor': cursor,
      }), headers: _headers);
      if (r.statusCode == 200) return jsonDecode(r.body) as List<dynamic>;
      debugPrint('getProjects failed: ${r.statusCode} ${r.body}');
    } catch (e) { debugPrint('getProjects ex: $e'); }
    return [];
  }

  Future<Map<String, dynamic>?> getProject(String projectId) async {
    try {
      final r = await http.get(_u('/projects/$projectId'), headers: _headers);
      if (r.statusCode == 200) return jsonDecode(r.body) as Map<String, dynamic>;
    } catch (e) { debugPrint('getProject ex: $e'); }
    return null;
  }

  Future<Map<String, dynamic>?> createProject(String name, String? description) async {
    try {
      final r = await http.post(_u('/projects'), headers: _headers, body: jsonEncode({'name': name, 'description': description}));
      if (r.statusCode == 201) return jsonDecode(r.body) as Map<String, dynamic>;
      debugPrint('createProject failed: ${r.statusCode} ${r.body}');
    } catch (e) { debugPrint('createProject ex: $e'); }
    return null;
  }

  Future<Map<String, dynamic>?> updateProject(String projectId, {String? name, String? description}) async {
    try {
      final r = await http.put(_u('/projects/$projectId'), headers: _headers, body: jsonEncode({'name': name, 'description': description}));
      if (r.statusCode == 200) return jsonDecode(r.body) as Map<String, dynamic>;
    } catch (e) { debugPrint('updateProject ex: $e'); }
    return null;
  }

  Future<bool> deleteProject(String projectId) async {
    try {
      final r = await http.delete(_u('/projects/$projectId'), headers: _headers);
      return r.statusCode == 204;
    } catch (e) { debugPrint('deleteProject ex: $e'); }
    return false;
  }

  /* -------------------------- Project Membership ------------------------- */
  Future<List<dynamic>> getProjectMembers(String projectId) async {
    try {
      final r = await http.get(_u('/projects/$projectId/members'), headers: _headers);
      if (r.statusCode == 200) return jsonDecode(r.body) as List<dynamic>;
    } catch (e) { debugPrint('getProjectMembers ex: $e'); }
    return [];
  }

  Future<Map<String, dynamic>?> addProjectMember(String projectId, String userId, String role) async {
    try {
      final r = await http.post(_u('/projects/$projectId/members'), headers: _headers, body: jsonEncode({'userId': userId, 'role': role}));
      if (r.statusCode == 201) return jsonDecode(r.body) as Map<String, dynamic>;
    } catch (e) { debugPrint('addProjectMember ex: $e'); }
    return null;
  }

  Future<bool> removeProjectMember(String projectId, String userId) async {
    try {
      final r = await http.delete(_u('/projects/$projectId/members/$userId'), headers: _headers);
      return r.statusCode == 204;
    } catch (e) { debugPrint('removeProjectMember ex: $e'); }
    return false;
  }

  /* --------------------------------- Tasks ------------------------------- */
  Future<List<dynamic>> getProjectTasks(String projectId, {String? status, String? assigneeId, int? limit, String? cursor}) async {
    try {
      final r = await http.get(_u('/projects/$projectId/tasks', {
        if (status != null) 'status': status,
        if (assigneeId != null) 'assigneeId': assigneeId,
        if (limit != null) 'limit': '$limit',
        if (cursor != null) 'cursor': cursor,
      }), headers: _headers);
      if (r.statusCode == 200) return jsonDecode(r.body) as List<dynamic>;
      debugPrint('getProjectTasks failed: ${r.statusCode} ${r.body}');
    } catch (e) { debugPrint('getProjectTasks ex: $e'); }
    return [];
  }

Future<Map<String, dynamic>?> createTask({
  required String projectId,
  required String title,
  String? description,
  String? status,
  String? dueDate,
  String? assigneeId,
}) async {
  try {
    final r = await http.post(
      _u('/projects/$projectId/tasks'),
      headers: _headers,
      body: jsonEncode({
        'title': title,
        'description': description,
        'status': status,
        'dueDate': dueDate,
        'assigneeId': assigneeId,
      }),
    );
    if (r.statusCode == 201) return jsonDecode(r.body) as Map<String, dynamic>;
  } catch (e) { debugPrint('createTask ex: $e'); }
  return null;
}


  Future<Map<String, dynamic>?> getTaskScoped(String projectId, String taskId) async {
    try {
      final r = await http.get(_u('/projects/$projectId/tasks/$taskId'), headers: _headers);
      if (r.statusCode == 200) return jsonDecode(r.body) as Map<String, dynamic>;
    } catch (e) { debugPrint('getTaskScoped ex: $e'); }
    return null;
  }

  Future<Map<String, dynamic>?> updateTask(String projectId, String taskId,
      {String? title, String? description, String? status, String? dueDate, String? assigneeId}) async {
    try {
      final r = await http.put(_u('/projects/$projectId/tasks/$taskId'), headers: _headers,
          body: jsonEncode({'title': title, 'description': description, 'status': status, 'dueDate': dueDate, 'assigneeId': assigneeId}));
      if (r.statusCode == 200) return jsonDecode(r.body) as Map<String, dynamic>;
    } catch (e) { debugPrint('updateTask ex: $e'); }
    return null;
  }

  Future<bool> deleteTask(String projectId, String taskId) async {
    try {
      final r = await http.delete(_u('/projects/$projectId/tasks/$taskId'), headers: _headers);
      return r.statusCode == 204;
    } catch (e) { debugPrint('deleteTask ex: $e'); }
    return false;
  }

  // Global tasks (user-centric)
  Future<List<dynamic>> getMyTasks({String assigneeId = 'me', String? projectId, String? status, int? limit, String? cursor}) async {
    try {
      final r = await http.get(_u('/tasks', {
        if (assigneeId.isNotEmpty) 'assigneeId': assigneeId,
        if (projectId != null) 'projectId': projectId,
        if (status != null) 'status': status,
        if (limit != null) 'limit': '$limit',
        if (cursor != null) 'cursor': cursor,
      }), headers: _headers);
      if (r.statusCode == 200) return jsonDecode(r.body) as List<dynamic>;
    } catch (e) { debugPrint('getMyTasks ex: $e'); }
    return [];
  }

  Future<Map<String, dynamic>?> getTaskGlobal(String taskId) async {
    try {
      final r = await http.get(_u('/tasks/$taskId'), headers: _headers);
      if (r.statusCode == 200) return jsonDecode(r.body) as Map<String, dynamic>;
    } catch (e) { debugPrint('getTaskGlobal ex: $e'); }
    return null;
  }

  /* ------------------------------- Messages ------------------------------ */
  Future<List<dynamic>> getMessages(String projectId, {String? parentId}) async {
    try {
      final r = await http.get(_u('/projects/$projectId/messages', {
        if (parentId != null) 'parentId': parentId,
      }), headers: _headers);
      if (r.statusCode == 200) return jsonDecode(r.body) as List<dynamic>;
    } catch (e) { debugPrint('getMessages ex: $e'); }
    return [];
  }

  Future<Map<String, dynamic>?> postMessage({required String projectId, String? parentId, required String text}) async {
    try {
      final r = await http.post(_u('/projects/$projectId/messages'), headers: _headers,
          body: jsonEncode({'text': text, if (parentId != null) 'parentId': parentId}));
      if (r.statusCode == 201) return jsonDecode(r.body) as Map<String, dynamic>;
      debugPrint('postMessage failed: ${r.statusCode} ${r.body}');
    } catch (e) { debugPrint('postMessage ex: $e'); }
    return null;
  }

  Future<Map<String, dynamic>?> getMessage(String projectId, String messageId) async {
    try {
      final r = await http.get(_u('/projects/$projectId/messages/$messageId'), headers: _headers);
      if (r.statusCode == 200) return jsonDecode(r.body) as Map<String, dynamic>;
    } catch (e) { debugPrint('getMessage ex: $e'); }
    return null;
  }

  Future<Map<String, dynamic>?> updateMessage(String projectId, String messageId, String text) async {
    try {
      final r = await http.put(_u('/projects/$projectId/messages/$messageId'), headers: _headers, body: jsonEncode({'text': text}));
      if (r.statusCode == 200) return jsonDecode(r.body) as Map<String, dynamic>;
    } catch (e) { debugPrint('updateMessage ex: $e'); }
    return null;
  }

  Future<bool> deleteMessage(String projectId, String messageId) async {
    try {
      final r = await http.delete(_u('/projects/$projectId/messages/$messageId'), headers: _headers);
      return r.statusCode == 204;
    } catch (e) { debugPrint('deleteMessage ex: $e'); }
    return false;
  }

  /* ---------------------------- Notifications ---------------------------- */
  Future<List<dynamic>> getNotifications() async {
    try {
      final r = await http.get(_u('/notifications'), headers: _headers);
      if (r.statusCode == 200) return jsonDecode(r.body) as List<dynamic>;
    } catch (e) { debugPrint('getNotifications ex: $e'); }
    return [];
  }

  Future<bool> markNotificationRead(String id) async {
    try {
      final r = await http.post(_u('/notifications/$id/read'), headers: _headers);
      return r.statusCode == 204;
    } catch (e) { debugPrint('markNotificationRead ex: $e'); }
    return false;
  }
}
