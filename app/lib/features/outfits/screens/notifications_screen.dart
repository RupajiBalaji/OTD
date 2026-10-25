import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/theme/otd_tokens.dart';
import '../outfits_repository.dart';

class NotificationsScreen extends ConsumerStatefulWidget {
  const NotificationsScreen({super.key});

  @override
  ConsumerState<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationItemData {
  final String id;
  final String title;
  final String message;
  final String time;
  final String type;
  bool read;

  _NotificationItemData({
    required this.id,
    required this.title,
    required this.message,
    required this.time,
    required this.type,
    this.read = false,
  });
}

class _NotificationsScreenState extends ConsumerState<NotificationsScreen> {
  late List<_NotificationItemData> _items;

  @override
  void initState() {
    super.initState();
    _items = [
      _NotificationItemData(
        id: '1',
        title: 'Weather Shift Forecast',
        message: 'Expected evening breeze. Adding a light linen overshirt or knit layer to your look is recommended.',
        time: '2h ago',
        type: 'weather',
      ),
      _NotificationItemData(
        id: '2',
        title: 'Upcoming Occasion',
        message: 'High-stakes evening dinner scheduled in 2 days. Stylist pre-curated 3 tailored options.',
        time: '5h ago',
        type: 'occasion',
      ),
      _NotificationItemData(
        id: '3',
        title: 'Wardrobe Milestone',
        message: 'Your Italian Wool Blazer achieved a cost-per-wear under \$28. Excellent utilization.',
        time: '1d ago',
        type: 'style',
        read: true,
      ),
      _NotificationItemData(
        id: '4',
        title: 'Atelier Trend Dispatch',
        message: 'Monochrome tailoring and earthy taupe tones trending in Milan vernissages this season.',
        time: '2d ago',
        type: 'style',
        read: true,
      ),
    ];
  }

  void _markAllAsRead() {
    setState(() {
      for (var item in _items) {
        item.read = true;
      }
    });
  }

  void _dismissNotification(String id) {
    setState(() {
      _items.removeWhere((i) => i.id == id);
    });
  }

  @override
  Widget build(BuildContext context) {
    final colors = OtdColors.of(context);
    final userProfile = ref.watch(userProfileProvider);
    final unreadCount = _items.where((i) => !i.read).length;

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        backgroundColor: colors.canvas,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new, size: 20, color: colors.textPrimary),
          tooltip: 'Back',
          onPressed: () => context.pop(),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '${userProfile.city.toUpperCase()} · DISPATCH',
              style: OtdTokens.caption(
                color: colors.accent,
                weight: FontWeight.w700,
              ).copyWith(letterSpacing: 2.0),
            ),
            Text(
              'Editorial Notifications',
              style: OtdTokens.headingSmall(color: colors.textPrimary, weight: FontWeight.w700),
            ),
          ],
        ),
        actions: [
          if (unreadCount > 0)
            TextButton(
              onPressed: _markAllAsRead,
              child: Text(
                'Mark read',
                style: OtdTokens.caption(color: colors.accent, weight: FontWeight.w700),
              ),
            ),
        ],
      ),
      body: SafeArea(
        child: _items.isEmpty
            ? Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Iconsax.notification_bing, size: 48, color: colors.textMuted),
                    const SizedBox(height: 12),
                    Text(
                      'No Notifications',
                      style: OtdTokens.headingSmall(color: colors.textPrimary),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'You are up to date with all style dispatches.',
                      style: OtdTokens.bodySmall(color: colors.textSecondary),
                    ),
                  ],
                ),
              )
            : ListView.separated(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.symmetric(
                  horizontal: OtdTokens.screenPaddingH,
                  vertical: 16,
                ),
                itemCount: _items.length,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final notif = _items[index];
                  IconData icon;
                  Color iconColor;

                  switch (notif.type) {
                    case 'weather':
                      icon = Iconsax.sun_1;
                      iconColor = AppTheme.gold;
                      break;
                    case 'occasion':
                      icon = Iconsax.calendar_1;
                      iconColor = const Color(0xFFC48B5A);
                      break;
                    default:
                      icon = Iconsax.magic_star;
                      iconColor = AppTheme.gold;
                  }

                  return Dismissible(
                    key: Key(notif.id),
                    direction: DismissDirection.endToStart,
                    onDismissed: (_) => _dismissNotification(notif.id),
                    background: Container(
                      alignment: Alignment.centerRight,
                      padding: const EdgeInsets.only(right: 20),
                      decoration: BoxDecoration(
                        color: Colors.redAccent.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Icon(Iconsax.trash, color: Colors.redAccent),
                    ),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: notif.read ? colors.card : colors.card.withValues(alpha: 0.95),
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(
                          color: notif.read ? colors.border : colors.accent.withValues(alpha: 0.6),
                          width: notif.read ? 1.0 : 1.5,
                        ),
                        boxShadow: notif.read ? null : OtdTokens.softShadow(isDark: colors.isDark, blur: 8),
                      ),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: iconColor.withValues(alpha: 0.15),
                              shape: BoxShape.circle,
                            ),
                            child: Icon(icon, color: iconColor, size: 20),
                          ),
                          const SizedBox(width: 14),
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
                                        style: OtdTokens.bodyMedium(
                                          color: colors.textPrimary,
                                          weight: notif.read ? FontWeight.w600 : FontWeight.w700,
                                        ),
                                      ),
                                    ),
                                    Text(
                                      notif.time,
                                      style: OtdTokens.caption(color: colors.textMuted),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 6),
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
    );
  }
}
