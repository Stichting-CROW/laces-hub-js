export function likeUUID(value?: string): boolean {
  return /^[a-z0-9]{8}-([a-z0-9]{4}-){3}[a-z0-9]{12}$/i.test(value || "");
}
