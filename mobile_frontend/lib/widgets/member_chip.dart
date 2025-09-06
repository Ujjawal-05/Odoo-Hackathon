import 'package:flutter/material.dart';

class MemberChip extends StatelessWidget {
  final String name;
  final String? avatarUrl;
  final VoidCallback? onTap;

  const MemberChip({super.key, required this.name, this.avatarUrl, this.onTap});

  @override
  Widget build(BuildContext context) {
    final initials = name.isNotEmpty
        ? name.trim().split(' ').map((e) => e[0]).take(2).join()
        : '?';
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(24),
      child: Chip(
        avatar: avatarUrl != null
            ? CircleAvatar(backgroundImage: NetworkImage(avatarUrl!))
            : CircleAvatar(
                backgroundColor: Theme.of(context).colorScheme.primaryContainer,
                child: Text(initials,
                    style: TextStyle(
                        color: Theme.of(context).colorScheme.onPrimaryContainer))),
        label: Text(name, overflow: TextOverflow.ellipsis),
      ),
    );
  }
}
