export default function getGroupMembers(group) {
  return [...(group?.farmers || []), ...(group?.agroProcessors || [])];
}
