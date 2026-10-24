import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';

class NotificationItem {
  final String id;
  final String title;
  final String message;
  final String time;
  final String type; // 'weather', 'occasion', 'style'
  bool read;

  NotificationItem({
    required this.id,
    required this.title,
    required this.message,
    required this.time,
    required this.type,
    this.read = false,
  });
}

class NotificationsSheet extends StatefulWidget {
  const NotificationsSheet({super.key});

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const NotificationsSheet(),
    );
  }

  @override
  State<NotificationsSheet> createState() => _NotificationsSheetState();
}

class _NotificationsSheetState extends State<NotificationsSheet> {
  final List<NotificationItem> _notifications = [
    NotificationItem(
      id: 'notif-1',
      title: 'Hyderabad Weather Notice',
      message: 'Partly cloudy tonight (28°C) with light breeze. Light linen and structured draping recommended.',
      time: '25m ago',
      type: 'weather',
      read: false,
    ),
    NotificationItem(
      id: 'notif-2',
      title: 'Upcoming Occasion: Dinner at L\'amore',
      message: 'Scheduled for tonight at 8:00 PM. Your outfit "The Parisian Minimalist" is ready.',
      time: '2h ago',
      type: 'occasion',
      read: false,
    ),
    NotificationItem(
      id: 'notif-3',
      title: 'Style Synergy Match',
      message: 'Your new Navy Hopsack Blazer creates 4 new versatile combinations with your existing trousers.',
      time: '1d ago',
      type: 'style',
      read: true,
    ),
  ];

  void _markAllAsRead() {
    setState(() {
      for (var n in _notifications) {
        n.read = true;
      }
    });
  }

  void _clearNotification(String id) {
    setState(() {
      _notifications.removeWhere((n) => n.id == id);
    });
  }

  IconData _getIcon(String type) {
    switch (type) {
      case 'weather':
        return Icons.wb_cloudy_outlined;
      case 'occasion':
        return Icons.calendar_today_outlined;
      case 'style':
        return Icons.auto_awesome;
      default:
        return Icons.notifications_outlined;
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final surfaceColor = isDark ? AppTheme.surfaceNoir : AppTheme.surfaceIvory;
    final elevatedColor = isDark ? AppTheme.elevatedNoir : AppTheme.elevatedIvory;
    final borderColor = isDark ? AppTheme.borderNoir : AppTheme.borderIvory;
    final textColor = isDark ? AppTheme.silkWhite : AppTheme.textIvoryDark;
    final mutedColor = isDark ? AppTheme.mutedSilver : AppTheme.textIvoryMuted;

    return Container(
      decoration: BoxDecoration(
        color: surfaceColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
        border: const Border(top: BorderSide(color: AppTheme.gold, width: 1.5)),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Drag handle
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: mutedColor.withValues(alpha: 0.3),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      color: AppTheme.gold.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: AppTheme.gold.withValues(alpha: 0.4)),
                    ),
                    alignment: Alignment.center,
                    child: const Icon(Icons.notifications_none, size: 16, color: AppTheme.gold),
                  ),
                  const SizedBox(width: 10),
                  Text(
                    'NOTIFICATIONS',
                    style: GoogleFonts.outfit(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 1.8,
                      color: AppTheme.gold,
                    ),
                  ),
                ],
              ),
              Row(
                children: [
                  TextButton(
                    onPressed: _markAllAsRead,
                    child: Text(
                      'Mark read',
                      style: GoogleFonts.outfit(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: AppTheme.gold,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, size: 20),
                    color: mutedColor,
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),

          if (_notifications.isEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 36),
              child: Center(
                child: Column(
                  children: [
                    Icon(Icons.notifications_off_outlined, size: 40, color: mutedColor),
                    const SizedBox(height: 8),
                    Text(
                      'No notifications right now',
                      style: GoogleFonts.outfit(fontSize: 13, color: mutedColor),
                    ),
                  ],
                ),
              ),
            )
          else
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _notifications.length,
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final notif = _notifications[index];
                return Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: elevatedColor,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: notif.read ? borderColor : AppTheme.gold.withValues(alpha: 0.4),
                      width: notif.read ? 1 : 1.5,
                    ),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(
                          color: AppTheme.gold.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        alignment: Alignment.center,
                        child: Icon(_getIcon(notif.type), size: 16, color: AppTheme.gold),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: Text(
                                    notif.title,
                                    style: GoogleFonts.outfit(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w700,
                                      color: textColor,
                                    ),
                                  ),
                                ),
                                Text(
                                  notif.time,
                                  style: GoogleFonts.outfit(
                                    fontSize: 10,
                                    color: mutedColor,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              notif.message,
                              style: GoogleFonts.outfit(
                                fontSize: 11,
                                color: mutedColor,
                                height: 1.35,
                              ),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, size: 14),
                        color: mutedColor,
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                        onPressed: () => _clearNotification(notif.id),
                      ),
                    ],
                  ),
                );
              },
            ),
          const SizedBox(height: 10),
        ],
      ),
    );
  }
}
