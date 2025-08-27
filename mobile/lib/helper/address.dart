import 'package:mobile_nirwana/data/models/property/address.dart';

class AddressHelper {
  static String formatSingleLine(Address? address) {
    if (address == null) return "";

    return [
      address.street,
      address.village,
      address.district,
      address.city,
      address.province,
      address.postalCode,
    ].where((e) => e != null && e.isNotEmpty).join(', ');
  }

  static List<String> formatMultiLine(Address? address) {
    if (address == null) return [];

    final List<String> lines = [];
    if (address.street?.isNotEmpty ?? false) lines.add(address.street!);
    if (address.village?.isNotEmpty ?? false)
      lines.add("Desa ${address.village!}");
    if (address.district?.isNotEmpty ?? false)
      lines.add("Kec. ${address.district!}");
    if (address.city?.isNotEmpty ?? false) lines.add(address.city!);
    if (address.province?.isNotEmpty ?? false) lines.add(address.province!);
    if (address.postalCode?.isNotEmpty ?? false)
      lines.add("Kode Pos ${address.postalCode!}");

    return lines;
  }
}

class AreaHelper {
  static String formatSingleLine(Address? address) {
    if (address == null) return "";

    return [
      address.village,
      address.city,
    ].where((e) => e != null && e.isNotEmpty).join(', ');
  }

  static List<String> formatMultiLine(Address? address) {
    if (address == null) return [];

    final List<String> lines = [];

    if (address.village?.isNotEmpty ?? false)
      lines.add("Desa ${address.village!}");

    if (address.city?.isNotEmpty ?? false) lines.add(address.city!);

    return lines;
  }
}
