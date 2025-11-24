export function isGreeting(text: string): boolean {
  const greetings = [
    'halo', 'helo', 'hallo', 'hi', 'hai',
    'hello', 'apa kabar', 'pagi', 'siang',
    'sore', 'malam', 'selamat pagi',
    'selamat siang', 'selamat sore', 'selamat malam',
  ];

  return greetings.includes(text.toLowerCase().trim());
}
