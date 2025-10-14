export function getFirstName(fullName: string) {
  return fullName.split(" ")[0] ?? fullName;
}
