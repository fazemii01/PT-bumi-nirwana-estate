"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGreeting = isGreeting;
function isGreeting(text) {
    const greetings = [
        'halo', 'helo', 'hallo', 'hi', 'hai',
        'hello', 'apa kabar', 'pagi', 'siang',
        'sore', 'malam', 'selamat pagi',
        'selamat siang', 'selamat sore', 'selamat malam',
    ];
    return greetings.includes(text.toLowerCase().trim());
}
//# sourceMappingURL=greetings.js.map