import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';

class AuthModalSheet extends StatefulWidget {
  final String initialMode; // 'signin', 'signup', 'forgot'

  const AuthModalSheet({super.key, this.initialMode = 'signin'});

  static void show(BuildContext context, {String initialMode = 'signin'}) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => AuthModalSheet(initialMode: initialMode),
    );
  }

  @override
  State<AuthModalSheet> createState() => _AuthModalSheetState();
}

class _AuthModalSheetState extends State<AuthModalSheet> {
  late String _mode;
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _identifierController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool _isLoading = false;
  String? _errorMessage;
  String? _successMessage;

  @override
  void initState() {
    super.initState();
    _mode = widget.initialMode;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _identifierController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleSubmit() {
    setState(() {
      _errorMessage = null;
      _successMessage = null;
    });

    final id = _identifierController.text.trim();
    final pass = _passwordController.text.trim();
    final name = _nameController.text.trim();

    if (_mode == 'signup' && name.isEmpty) {
      setState(() => _errorMessage = 'Please enter your full name.');
      return;
    }
    if (id.isEmpty) {
      setState(() => _errorMessage = 'Please enter your email or phone number.');
      return;
    }
    if (_mode != 'forgot' && pass.isEmpty) {
      setState(() => _errorMessage = 'Please enter your password.');
      return;
    }
    if (_mode == 'signup' && pass.length < 8) {
      setState(() => _errorMessage = 'Password must be at least 8 characters long.');
      return;
    }

    setState(() => _isLoading = true);

    Future.delayed(const Duration(milliseconds: 900), () {
      if (!mounted) return;
      setState(() => _isLoading = false);

      if (_mode == 'forgot') {
        setState(() {
          _successMessage = 'Password reset instructions have been dispatched to $id.';
        });
      } else {
        setState(() {
          _successMessage = _mode == 'signup'
              ? 'Welcome to OTD! Your Haute styling account is ready.'
              : 'Signed in successfully as ${id.split('@').first}.';
        });
        Future.delayed(const Duration(milliseconds: 700), () {
          if (mounted) Navigator.pop(context);
        });
      }
    });
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
      padding: EdgeInsets.only(
        left: 24,
        right: 24,
        top: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      decoration: BoxDecoration(
        color: surfaceColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
        border: const Border(top: BorderSide(color: AppTheme.gold, width: 1.5)),
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Center drag handle
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

            // Header Row
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
                      child: const Icon(Icons.lock_outline, size: 16, color: AppTheme.gold),
                    ),
                    const SizedBox(width: 10),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _mode == 'signup'
                              ? 'JOIN OTD ATELIER'
                              : _mode == 'forgot'
                                  ? 'RESET PASSWORD'
                                  : 'SIGN IN TO OTD',
                          style: GoogleFonts.outfit(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 1.5,
                            color: AppTheme.gold,
                          ),
                        ),
                        Text(
                          _mode == 'signup'
                              ? 'Create Your Wardrobe'
                              : _mode == 'forgot'
                                  ? 'Account Recovery'
                                  : 'Welcome Back',
                          style: GoogleFonts.cormorantGaramond(
                            fontSize: 20,
                            fontWeight: FontWeight.w700,
                            color: textColor,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.close, size: 20),
                  color: mutedColor,
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 16),

            if (_errorMessage != null)
              Container(
                margin: const EdgeInsets.only(bottom: 14),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.red.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.red.withValues(alpha: 0.3)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.error_outline, size: 16, color: Colors.red),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        _errorMessage!,
                        style: GoogleFonts.outfit(fontSize: 11, color: Colors.red),
                      ),
                    ),
                  ],
                ),
              ),

            if (_successMessage != null)
              Container(
                margin: const EdgeInsets.only(bottom: 14),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFF10B981).withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFF10B981).withValues(alpha: 0.4)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.check_circle_outline, size: 16, color: Color(0xFF10B981)),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        _successMessage!,
                        style: GoogleFonts.outfit(fontSize: 11, color: const Color(0xFF10B981)),
                      ),
                    ),
                  ],
                ),
              ),

            // Mode Selector Pill Tab
            Container(
              decoration: BoxDecoration(
                color: elevatedColor,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: borderColor),
              ),
              padding: const EdgeInsets.all(3),
              child: Row(
                children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() {
                        _mode = 'signin';
                        _errorMessage = null;
                      }),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        decoration: BoxDecoration(
                          color: _mode == 'signin' ? AppTheme.gold : Colors.transparent,
                          borderRadius: BorderRadius.circular(11),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          'Sign In',
                          style: GoogleFonts.outfit(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: _mode == 'signin' ? AppTheme.noir : textColor,
                          ),
                        ),
                      ),
                    ),
                  ),
                  Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() {
                        _mode = 'signup';
                        _errorMessage = null;
                      }),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        decoration: BoxDecoration(
                          color: _mode == 'signup' ? AppTheme.gold : Colors.transparent,
                          borderRadius: BorderRadius.circular(11),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          'Create Account',
                          style: GoogleFonts.outfit(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: _mode == 'signup' ? AppTheme.noir : textColor,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),

            // Form Fields
            if (_mode == 'signup') ...[
              Text(
                'FULL NAME',
                style: GoogleFonts.outfit(fontSize: 9, fontWeight: FontWeight.w700, letterSpacing: 1.0, color: mutedColor),
              ),
              const SizedBox(height: 6),
              TextField(
                controller: _nameController,
                style: GoogleFonts.outfit(fontSize: 13, color: textColor),
                decoration: InputDecoration(
                  hintText: 'Mustafa Ali',
                  hintStyle: GoogleFonts.outfit(fontSize: 12, color: mutedColor.withValues(alpha: 0.5)),
                  prefixIcon: const Icon(Icons.person_outline, size: 18, color: AppTheme.gold),
                  filled: true,
                  fillColor: elevatedColor,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: borderColor)),
                  enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: borderColor)),
                  focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: AppTheme.gold)),
                ),
              ),
              const SizedBox(height: 12),
            ],

            Text(
              'EMAIL OR PHONE NUMBER',
              style: GoogleFonts.outfit(fontSize: 9, fontWeight: FontWeight.w700, letterSpacing: 1.0, color: mutedColor),
            ),
            const SizedBox(height: 6),
            TextField(
              controller: _identifierController,
              keyboardType: TextInputType.emailAddress,
              style: GoogleFonts.outfit(fontSize: 13, color: textColor),
              decoration: InputDecoration(
                hintText: 'curator@otd.fashion',
                hintStyle: GoogleFonts.outfit(fontSize: 12, color: mutedColor.withValues(alpha: 0.5)),
                prefixIcon: const Icon(Icons.mail_outline, size: 18, color: AppTheme.gold),
                filled: true,
                fillColor: elevatedColor,
                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: borderColor)),
                enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: borderColor)),
                focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: AppTheme.gold)),
              ),
            ),
            const SizedBox(height: 12),

            if (_mode != 'forgot') ...[
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'PASSWORD',
                    style: GoogleFonts.outfit(fontSize: 9, fontWeight: FontWeight.w700, letterSpacing: 1.0, color: mutedColor),
                  ),
                  if (_mode == 'signin')
                    GestureDetector(
                      onTap: () => setState(() => _mode = 'forgot'),
                      child: Text(
                        'Forgot password?',
                        style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w600, color: AppTheme.gold),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 6),
              TextField(
                controller: _passwordController,
                obscureText: _obscurePassword,
                style: GoogleFonts.outfit(fontSize: 13, color: textColor),
                decoration: InputDecoration(
                  hintText: '••••••••',
                  hintStyle: GoogleFonts.outfit(fontSize: 12, color: mutedColor.withValues(alpha: 0.5)),
                  prefixIcon: const Icon(Icons.key_outlined, size: 18, color: AppTheme.gold),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscurePassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                      size: 18,
                      color: mutedColor,
                    ),
                    onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                  ),
                  filled: true,
                  fillColor: elevatedColor,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: borderColor)),
                  enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: borderColor)),
                  focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: AppTheme.gold)),
                ),
              ),
              const SizedBox(height: 18),
            ],

            // Submit Button
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.gold,
                  foregroundColor: AppTheme.noir,
                  elevation: 2,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                onPressed: _isLoading ? null : _handleSubmit,
                child: _isLoading
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: AppTheme.noir))
                    : Text(
                        _mode == 'signup'
                            ? 'CREATE OTD ACCOUNT'
                            : _mode == 'forgot'
                                ? 'SEND RECOVERY LINK'
                                : 'ENTER OTD STUDIO',
                        style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w800, letterSpacing: 1.0),
                      ),
              ),
            ),
            const SizedBox(height: 12),

            // Social Logins (Google & Apple)
            Row(
              children: [
                Expanded(child: Divider(color: borderColor)),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 10),
                  child: Text('OR CONTINUE WITH', style: GoogleFonts.outfit(fontSize: 9, color: mutedColor, letterSpacing: 1.0)),
                ),
                Expanded(child: Divider(color: borderColor)),
              ],
            ),
            const SizedBox(height: 12),

            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    icon: const Icon(Icons.g_mobiledata, size: 22, color: AppTheme.gold),
                    label: Text('Google', style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w600, color: textColor)),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      side: BorderSide(color: borderColor),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    onPressed: () {
                      final navigator = Navigator.of(context);
                      setState(() => _successMessage = 'Google SSO authentication connected.');
                      Future.delayed(const Duration(milliseconds: 600), () {
                        if (mounted) navigator.pop();
                      });
                    },
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: OutlinedButton.icon(
                    icon: const Icon(Icons.apple, size: 20, color: AppTheme.gold),
                    label: Text('Apple ID', style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w600, color: textColor)),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      side: BorderSide(color: borderColor),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    onPressed: () {
                      final navigator = Navigator.of(context);
                      setState(() => _successMessage = 'Apple ID authenticated.');
                      Future.delayed(const Duration(milliseconds: 600), () {
                        if (mounted) navigator.pop();
                      });
                    },
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
