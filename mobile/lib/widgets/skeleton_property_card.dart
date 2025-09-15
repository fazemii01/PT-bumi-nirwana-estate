import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class SkeletonPropertyCard extends StatelessWidget {
  const SkeletonPropertyCard({super.key});

  @override
  Widget build(BuildContext context) {
    // 1. Container utama sekarang menjadi root widget.
    //    Ini adalah 'kanvas' putih untuk kartu kita.
    return AspectRatio(
      aspectRatio: 1.1,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          // Tambahkan shadow agar sama persis dengan card aslinya
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              offset: const Offset(0, 8),
              blurRadius: 24,
            ),
          ],
        ),
        // 2. Pindahkan Shimmer.fromColors ke DALAM Container utama.
        //    Efek kilauan hanya akan berlaku untuk child-nya.
        child: Shimmer.fromColors(
          baseColor: Colors.grey[300]!,
          highlightColor: Colors.grey[100]!,
          // 3. Child dari Shimmer sekarang adalah Column yang berisi semua placeholder.
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Skeleton untuk Area Gambar
              Expanded(
                flex: 3,
                child: Container(
                  decoration: const BoxDecoration(
                    color:
                        Colors.white, // Warna ini akan 'dilubangi' oleh Shimmer
                    borderRadius:
                        BorderRadius.vertical(top: Radius.circular(20)),
                  ),
                ),
              ),
              // Skeleton untuk Area Konten Bawah
              Expanded(
                flex: 2,
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Skeleton untuk Judul
                      Container(
                        width: double.infinity,
                        height: 16.0,
                        decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(4)),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        width: MediaQuery.of(context).size.width * 0.7,
                        height: 16.0,
                        decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(4)),
                      ),
                      const Spacer(),
                      // Skeleton untuk Detail dan Harga
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            width: MediaQuery.of(context).size.width * 0.3,
                            height: 14.0,
                            decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(4)),
                          ),
                          Container(
                            width: MediaQuery.of(context).size.width * 0.2,
                            height: 16.0,
                            decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(4)),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
