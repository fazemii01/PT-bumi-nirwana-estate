import 'package:flutter/widgets.dart';
import 'package:get/get.dart';
import 'package:mobile_nirwana/data/models/chat-message.dart';
import 'package:mobile_nirwana/data/service/eligibility_service.dart';

class EligibilityController extends GetxController
    with GetTickerProviderStateMixin {
  final EligibilityService _service = EligibilityService();

  var isLoading = false.obs;
  var result = "".obs;

  final TextEditingController promptController = TextEditingController();
  final ScrollController scrollController = ScrollController();

  final RxList<ChatMessage> messages = <ChatMessage>[].obs;
  final RxBool isTyping = false.obs;

  late AnimationController animationController;
  late AnimationController typewriterController;
  late Animation<double> fadeAnimation;

  final String welcomeText =
      "Uraikan hasil pengalaman simulasi KPR Anda untuk melihat hasil eligibilitas yang akurat berdasarkan profil finansial Anda";

  final RxString displayedWelcomeText = "".obs;
  final RxBool isWelcomeComplete = false.obs;
  int currentCharIndex = 0;

  @override
  void onInit() {
    super.onInit();

    animationController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );

    typewriterController = AnimationController(
      duration: const Duration(milliseconds: 50),
      vsync: this,
    );

    fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: animationController, curve: Curves.easeInOut),
    );

    _startWelcomeAnimation();
  }

  void _startWelcomeAnimation() {
    Future.delayed(const Duration(milliseconds: 50), _typewriterEffect);
  }

  void _typewriterEffect() {
    if (currentCharIndex < welcomeText.length) {
      currentCharIndex++;
      displayedWelcomeText.value = welcomeText.substring(0, currentCharIndex);
      Future.delayed(const Duration(milliseconds: 50), _typewriterEffect);
    } else {
      isWelcomeComplete.value = true;
      animationController.forward();
    }
  }

  Future<void> sendMessage() async {
    if (promptController.text.trim().isEmpty) return;

    final userMessage = ChatMessage(
      text: promptController.text.trim(),
      isUser: true,
      timestamp: DateTime.now(),
    );

    messages.add(userMessage);
    isTyping.value = true;

    final question = promptController.text.trim();
    promptController.clear();
    _scrollToBottom();

    await askEligibility(question);

    final aiResponse = ChatMessage(
      text: result.value,
      isUser: false,
      timestamp: DateTime.now(),
    );

    messages.add(aiResponse);
    isTyping.value = false;
    _scrollToBottom();
  }

  Future<void> askEligibility(String question) async {
    try {
      isLoading.value = true;
      final response = await _service.checkEligibility(question);
      result.value = response.result;
    } catch (e) {
      result.value = "Terjadi kesalahan";
    } finally {
      isLoading.value = false;
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (scrollController.hasClients) {
        scrollController.animateTo(
          scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  void onClose() {
    animationController.dispose();
    typewriterController.dispose();
    promptController.dispose();
    scrollController.dispose();
    super.onClose();
  }
}
