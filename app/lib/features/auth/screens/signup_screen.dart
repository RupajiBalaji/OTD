import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../core/theme/otd_tokens.dart';
import '../../../shared/widgets/otd_button.dart';
import '../auth_state_provider.dart';

class SignupScreen extends ConsumerStatefulWidget {
  const SignupScreen({super.key});

  @override
  ConsumerState<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends ConsumerState<SignupScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleSignup() async {
    if (!_formKey.currentState!.validate()) return;

    final success = await ref.read(authNotifierProvider.notifier).register(
          name: _nameController.text.trim(),
          email: _emailController.text.trim(),
          password: _passwordController.text.trim(),
        );

    if (success && mounted) {
      context.go('/onboarding/about');
    }
  }

  void _showComingSoon(String feature) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$feature is coming soon in the next release.'),
        backgroundColor: OtdTokens.goldDeep,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = OtdColors.of(context);
    final authState = ref.watch(authNotifierProvider).state;

    return Scaffold(
      backgroundColor: colors.canvas,
      appBar: AppBar(
        backgroundColor: colors.canvas,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new, size: 20, color: colors.textPrimary),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/login');
            }
          },
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.symmetric(
            horizontal: OtdTokens.screenPaddingH,
            vertical: 12,
          ),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Serif Header
                Text(
                  'Create Account',
                  style: OtdTokens.headingLarge(
                    color: colors.textPrimary,
                    weight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Join OTD to experience your personalized AI fashion companion and daily looks.',
                  style: OtdTokens.bodyMedium(color: colors.textMuted),
                ),

                const SizedBox(height: 32),

                // Error Banner
                if (authState.errorMessage != null) ...[
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      color: colors.isDark ? const Color(0xFF2A1518) : const Color(0xFFFDE8E8),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.red.withValues(alpha: 0.3)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.error_outline, color: Colors.redAccent, size: 20),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            authState.errorMessage!,
                            style: OtdTokens.bodySmall(color: Colors.redAccent),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                ],

                // Full Name Field
                Text(
                  'FULL NAME',
                  style: OtdTokens.label(color: colors.textSecondary, letterSpacing: 1.0),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _nameController,
                  textCapitalization: TextCapitalization.words,
                  style: OtdTokens.bodyLarge(color: colors.textPrimary),
                  decoration: InputDecoration(
                    hintText: 'Enter your name',
                    prefixIcon: Icon(Iconsax.user, size: 20, color: colors.textMuted),
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Please enter your name.';
                    }
                    if (value.trim().length < 2) {
                      return 'Name must be at least 2 characters.';
                    }
                    return null;
                  },
                ),

                const SizedBox(height: 20),

                // Email Field
                Text(
                  'EMAIL ADDRESS',
                  style: OtdTokens.label(color: colors.textSecondary, letterSpacing: 1.0),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  style: OtdTokens.bodyLarge(color: colors.textPrimary),
                  decoration: InputDecoration(
                    hintText: 'name@example.com',
                    prefixIcon: Icon(Iconsax.sms, size: 20, color: colors.textMuted),
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Please enter your email address.';
                    }
                    final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
                    if (!emailRegex.hasMatch(value.trim())) {
                      return 'Please enter a valid email address.';
                    }
                    return null;
                  },
                ),

                const SizedBox(height: 20),

                // Password Field
                Text(
                  'PASSWORD',
                  style: OtdTokens.label(color: colors.textSecondary, letterSpacing: 1.0),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _passwordController,
                  obscureText: _obscurePassword,
                  style: OtdTokens.bodyLarge(color: colors.textPrimary),
                  decoration: InputDecoration(
                    hintText: 'Minimum 8 characters',
                    prefixIcon: Icon(Iconsax.lock, size: 20, color: colors.textMuted),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscurePassword ? Iconsax.eye_slash : Iconsax.eye,
                        size: 20,
                        color: colors.textMuted,
                      ),
                      onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please create a password.';
                    }
                    if (value.length < 8) {
                      return 'Password must be at least 8 characters long.';
                    }
                    return null;
                  },
                ),

                const SizedBox(height: 32),

                // Primary Sign Up Button
                OtdButton(
                  text: 'Sign Up',
                  isLoading: authState.isLoading,
                  onPressed: _handleSignup,
                ),

                const SizedBox(height: 32),

                // "Or continue with" divider
                Row(
                  children: [
                    Expanded(child: Divider(color: colors.border)),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      child: Text(
                        'or continue with',
                        style: OtdTokens.bodySmall(color: colors.textMuted),
                      ),
                    ),
                    Expanded(child: Divider(color: colors.border)),
                  ],
                ),

                const SizedBox(height: 24),

                // Social Round Buttons (Google, Apple, Email)
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    _SocialIconButton(
                      icon: Icons.g_mobiledata,
                      iconSize: 34,
                      onTap: () => _showComingSoon('Google Sign-Up'),
                    ),
                    const SizedBox(width: 18),
                    _SocialIconButton(
                      icon: Icons.apple,
                      iconSize: 26,
                      onTap: () => _showComingSoon('Apple Sign-Up'),
                    ),
                    const SizedBox(width: 18),
                    _SocialIconButton(
                      icon: Iconsax.sms,
                      iconSize: 22,
                      onTap: () => _showComingSoon('Email Sign-Up'),
                    ),
                  ],
                ),

                const SizedBox(height: 36),

                // Already have account footer link
                Center(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Already have an account? ',
                        style: OtdTokens.bodyMedium(color: colors.textMuted),
                      ),
                      GestureDetector(
                        onTap: () => context.go('/login'),
                        child: Text(
                          'Log In',
                          style: OtdTokens.bodyMedium(
                            color: colors.textPrimary,
                            weight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _SocialIconButton extends StatelessWidget {
  final IconData icon;
  final double iconSize;
  final VoidCallback onTap;

  const _SocialIconButton({
    required this.icon,
    required this.iconSize,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final colors = OtdColors.of(context);

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(28),
      child: Container(
        width: 54,
        height: 54,
        decoration: BoxDecoration(
          color: colors.card,
          shape: BoxShape.circle,
          border: Border.all(color: colors.border),
          boxShadow: OtdTokens.softShadow(isDark: colors.isDark, blur: 6, offsetY: 2),
        ),
        child: Center(
          child: Icon(
            icon,
            size: iconSize,
            color: colors.textPrimary,
          ),
        ),
      ),
    );
  }
}
