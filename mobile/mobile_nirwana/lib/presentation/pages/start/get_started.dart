import 'package:flutter/material.dart';

class GetStartedScreen extends StatefulWidget {
  const GetStartedScreen({Key? key}) : super(key: key);

  @override
  State<GetStartedScreen> createState() => _GetStartedScreenState();
}

class _GetStartedScreenState extends State<GetStartedScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );
    _animation = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    );
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFFE6B800), // Golden yellow
              Color(0xFFFFD700), // Lighter yellow
              Color(0xFF2C5530), // Dark green at bottom
            ],
            stops: [0.0, 0.6, 1.0],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              const Spacer(flex: 2),

              // Main content
              Expanded(
                flex: 3,
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 40),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      FadeTransition(
                        opacity: _animation,
                        child: const Text(
                          "Let's find your\ndream house!",
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                            height: 1.2,
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      FadeTransition(
                        opacity: _animation,
                        child: Text(
                          "Lorem ipsum dolor sit amet,\nconsectetur adipis",
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.8),
                            fontSize: 16,
                            height: 1.4,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Illustration area
              Expanded(
                flex: 4,
                child: Stack(
                  children: [
                    // Background hills
                    Positioned(
                      bottom: 0,
                      left: 0,
                      right: 0,
                      child: CustomPaint(
                        size: Size(MediaQuery.of(context).size.width, 200),
                        painter: LandscapePainter(),
                      ),
                    ),
                  ],
                ),
              ),

              // Bottom section with navigation
              Container(
                padding: const EdgeInsets.all(30),
                child: Column(
                  children: [
                    // Page indicator dots
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          width: 6,
                          height: 6,
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.4),
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          width: 6,
                          height: 6,
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.4),
                            shape: BoxShape.circle,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 40),

                    // Next button
                    GestureDetector(
                      onTap: () {
                        // Handle navigation
                        print("Next button tapped");
                      },
                      child: Container(
                        width: 60,
                        height: 60,
                        decoration: const BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.arrow_forward,
                          color: Color(0xFFE6B800),
                          size: 24,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class LandscapePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..style = PaintingStyle.fill;

    // Draw back hills (lighter)
    paint.color = const Color(0xFF4A6741);
    final backHillPath = Path();
    backHillPath.moveTo(0, size.height);
    backHillPath.lineTo(0, size.height * 0.4);
    backHillPath.quadraticBezierTo(
      size.width * 0.3,
      size.height * 0.2,
      size.width * 0.6,
      size.height * 0.3,
    );
    backHillPath.quadraticBezierTo(
      size.width * 0.8,
      size.height * 0.35,
      size.width,
      size.height * 0.5,
    );
    backHillPath.lineTo(size.width, size.height);
    backHillPath.close();
    canvas.drawPath(backHillPath, paint);

    // Draw front hills (darker)
    paint.color = const Color(0xFF2C5530);
    final frontHillPath = Path();
    frontHillPath.moveTo(0, size.height);
    frontHillPath.lineTo(0, size.height * 0.6);
    frontHillPath.quadraticBezierTo(
      size.width * 0.2,
      size.height * 0.4,
      size.width * 0.4,
      size.height * 0.5,
    );
    frontHillPath.quadraticBezierTo(
      size.width * 0.7,
      size.height * 0.6,
      size.width,
      size.height * 0.7,
    );
    frontHillPath.lineTo(size.width, size.height);
    frontHillPath.close();
    canvas.drawPath(frontHillPath, paint);

    // Draw trees (simple triangular shapes)
    paint.color = const Color(0xFF1A3B1F);

    // Tree 1
    final tree1 = Path();
    tree1.moveTo(size.width * 0.15, size.height * 0.7);
    tree1.lineTo(size.width * 0.18, size.height * 0.5);
    tree1.lineTo(size.width * 0.21, size.height * 0.7);
    tree1.close();
    canvas.drawPath(tree1, paint);

    // Tree 2
    final tree2 = Path();
    tree2.moveTo(size.width * 0.25, size.height * 0.65);
    tree2.lineTo(size.width * 0.27, size.height * 0.48);
    tree2.lineTo(size.width * 0.29, size.height * 0.65);
    tree2.close();
    canvas.drawPath(tree2, paint);

    // Tree 3
    final tree3 = Path();
    tree3.moveTo(size.width * 0.75, size.height * 0.75);
    tree3.lineTo(size.width * 0.77, size.height * 0.6);
    tree3.lineTo(size.width * 0.79, size.height * 0.75);
    tree3.close();
    canvas.drawPath(tree3, paint);

    // Draw houses
    paint.color = const Color(0xFF8B4513); // Brown color for houses

    // House 1
    final house1 = Rect.fromLTWH(
      size.width * 0.4,
      size.height * 0.6,
      size.width * 0.08,
      size.height * 0.15,
    );
    canvas.drawRect(house1, paint);

    // House 1 roof
    paint.color = const Color(0xFF654321);
    final roof1 = Path();
    roof1.moveTo(size.width * 0.38, size.height * 0.6);
    roof1.lineTo(size.width * 0.44, size.height * 0.52);
    roof1.lineTo(size.width * 0.5, size.height * 0.6);
    roof1.close();
    canvas.drawPath(roof1, paint);

    // House 2
    paint.color = const Color(0xFF8B4513);
    final house2 = Rect.fromLTWH(
      size.width * 0.55,
      size.height * 0.65,
      size.width * 0.07,
      size.height * 0.12,
    );
    canvas.drawRect(house2, paint);

    // House 2 roof
    paint.color = const Color(0xFF654321);
    final roof2 = Path();
    roof2.moveTo(size.width * 0.53, size.height * 0.65);
    roof2.lineTo(size.width * 0.585, size.height * 0.58);
    roof2.lineTo(size.width * 0.64, size.height * 0.65);
    roof2.close();
    canvas.drawPath(roof2, paint);
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}

// Usage example:
void main() {
  runApp(MaterialApp(
    home: const GetStartedScreen(),
    debugShowCheckedModeBanner: false,
  ));
}
