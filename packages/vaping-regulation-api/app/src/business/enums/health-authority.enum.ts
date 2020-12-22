export enum HealthAuthority {
  COASTAL = 'coastal',
  FRASER = 'fraser',
  INTERIOR = 'interior',
  ISLAND = 'island',
  NORTHERN = 'northern',
}

const COASTAL_OPTIONS = new Set(['coastal', 'vch']);
const FRASER_OPTIONS = new Set(['fraser']);
const INTERIOR_OPTIONS = new Set(['interior', 'iha']);
const ISLAND_OPTIONS = new Set(['island', 'viha']);
const NORTHERN_OPTIONS = new Set(['northern']);

/**
 * Check every word from the DTO's health authority to see if any of our 'accepted words' are within
 * @param ha Health Authority string from DTO
 */
export const haTranslation = (ha: string): HealthAuthority => {
  const healthAuthorityWords = ha.toLowerCase().trim().split(' ');
  if (healthAuthorityWords.some((w) => COASTAL_OPTIONS.has(w))) return HealthAuthority.COASTAL;
  if (healthAuthorityWords.some((w) => FRASER_OPTIONS.has(w))) return HealthAuthority.FRASER;
  if (healthAuthorityWords.some((w) => INTERIOR_OPTIONS.has(w))) return HealthAuthority.INTERIOR;
  if (healthAuthorityWords.some((w) => ISLAND_OPTIONS.has(w))) return HealthAuthority.ISLAND;
  if (healthAuthorityWords.some((w) => NORTHERN_OPTIONS.has(w))) return HealthAuthority.NORTHERN;
}