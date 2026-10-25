import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:iconsax/iconsax.dart';
import '../../../core/theme/otd_tokens.dart';
import '../outfits_repository.dart';

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

class NotificationsSheet extends ConsumerStatefulWidget {
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
  ConsumerState<NotificationsSheet> createState() => _NotificationsSheetState();
}

class _NotificationsSheetState extends ConsumerState<NotificationsSheet> {
  late List<NotificationItem> _notifications;
  bool _initialized = false;

  void _initNotifications(String city) {
    if (_initialized) return;
    _initialized = true;

    _notifications = [
      NotificationItem(
        id: 'notif-1',
        title: '$city Weather Notice',
        message: 'Pleasant evening (24°C) with light breeze. Light linen and structured draping recommended.',
        time: '25m ago',
        type: 'weather',
        read: false,
      ),
      NotificationItem(
        id: 'notif-2',
        title: 'Upcoming Occasion: Dinner & Cocktails',
        message: 'Scheduled for tonight at 8:00 PM. Your curated ensemble is ready in Saved Looks.',
        time: '2h ago',
        type: 'occasion',
        read: false,
      ),
      NotificationItem(
        id: 'notif-3',
        title: 'Style Synergy Match',
        message: 'Your cashmere high-neck creates 4 new versatile combinations with your tailored trousers.',
        time: '1d ago',
        type: 'style',
        read: true,
      ),
    ];
  }

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
        return Iconsax.sun_1;
      case 'occasion':
        return Iconsax.calendar_1;
      case 'style':
        return Iconsax.magic_star;
      default:
        return Iconsax.notification;
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = OtdColors.of(context);
    final userProfile = ref.watch(userProfileProvider);
    _initNotifications(userProfile.city);

    return Container(
      constraints: BoxConstraints(
        maxHeight: MediaQuery.of(context).size.height * 0.8,
      ),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
        border: Border(top: BorderSide(color: colors.accent, width: 1.5)),
        boxShadow: OtdTokens.softShadow(isDark: colors.isDark, blur: 24, offsetY: -4),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 16),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Drag handle
          Center(
            child: Container(
              width: 44,
              height: 4,
              decoration: BoxDecoration(
                color: colors.textMuted.withValues(alpha: 0.3),
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
                    width: 34,
                    height: 34,
                    decoration: BoxDecoration(
                      color: colors.accent.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: colors.accent.withValues(alpha: 0.4)),
                    ),
                    alignment: Alignment.center,
                    child: Icon(Iconsax.notification, size: 18, color: colors.accent),
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'STUDIO NOTIFICATIONS',
                        style: OtdTokens.caption(
                          color: colors.accent,
                          weight: FontWeight.w700,
                        ).copyWith(letterSpacing: 1.5),
                      ),
                      Text(
                        'Activity & Alerts',
                        style: OtdTokens.headingSmall(color: colors.textPrimary, weight: FontWeight.w700),
                      ),
                    ],
                  ),
                ],
              ),
              if (_notifications.any((n) => !n.read))
                TextButton(
                  onPressed: _markAllAsRead,
                  child: Text(
                    'Mark read',
                    style: OtdTokens.label(color: colors.accent, weight: FontWeight.w600),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 14),

          // Notifications List
          Expanded(
            child: _notifications.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Iconsax.notification_bing, size: 40, color: colors.textMuted),
                        const SizedBox(height: 12),
                        Text(
                          'All caught up',
                          style: OtdTokens.headingSmall(color: colors.textPrimary),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'You have no unread notifications.',
                          style: OtdTokens.bodySmall(color: colors.textSecondary),
                        ),
                      ],
                    ),
                  )
                : ListView.separated(
                    physics: const BouncingScrollPhysics(),
                    itemCount: _notifications.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 10),
                    itemBuilder: (context, index) {
                      final notif = _notifications[index];

                      return Dismissible(
                        key: Key(notif.id),
                        direction: DismissDirection.endToStart,
                        onDismissed: (_) => _clearNotification(notif.id),
                        background: Container(
                          alignment: Alignment.centerRight,
                          padding: const EdgeInsets.only(right: 20),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF43F5E),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: const Icon(Icons.delete, color: Colors.white),
                        ),
                        child: Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: notif.read ? colors.canvas : colors.card,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: notif.read ? colors.border : colors.accent.withValues(alpha: 0.5),
                              width: notif.read ? 1.0 : 1.5,
                            ),
                          ),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: colors.canvas,
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(color: colors.border),
                                ),
                                child: Icon(_getIcon(notif.type), size: 16, color: colors.accent),
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
                                            style: OtdTokens.label(
                                              color: colors.textPrimary,
                                              weight: notif.read ? FontWeight.w600 : FontWeight.w700,
                                            ),
                                          ),
                                        ),
                                        Text(
                                          notif.time,
                                          style: OtdTokens.caption(color: colors.textMuted).copyWith(fontSize: 10),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      notif.message,
                                      style: OtdTokens.bodySmall(color: colors.textSecondary),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ),
          const SizedBox(height: 10),
        ],
      ),
    );
  }
}
