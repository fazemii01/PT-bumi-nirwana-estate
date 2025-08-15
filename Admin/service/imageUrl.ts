export const getImageUrl = (path: string) => {
  return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${path}`;
};
