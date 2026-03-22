/**
 * Builds Meilisearch filter string for resource visibility scoping.
 * 
 * This is the SINGLE SOURCE OF TRUTH for visibility rules.
 * Must be used by BOTH:
 *   1. search/service.ts — SearchService.searchResources()
 *   2. vault/service.ts — listResources() MongoDB query
 * 
 * Never duplicate this logic in multiple places.
 */
export function buildResourceVisibilityFilter(
  requestingStudent: {
    firebaseUid: string;
    campusId: string;
    collegeGroupId: string;
    nexus: { crossCampusEnabled: boolean };
    moderation: { status: 'good_standing' | 'warning' | 'suspended' | 'banned' };
  },
  nexusMode: boolean = false
): {
  meilisearchFilter: string;
  mongodbFilter: Record<string, any>;
} {
  const filters: string[] = [];

  // Always include public resources
  filters.push("visibility = 'public'");

  // Campus-scoped resources
  filters.push(
    `(visibility = 'campus_only' AND campus = '${requestingStudent.campusId}')`
  );

  // College group-scoped resources
  filters.push(
    `(visibility = 'college_group' AND collegeGroupId = '${requestingStudent.collegeGroupId}')`
  );

  // Nexus partner-scoped resources
  // Only included if:
  //   1. Student has nexus.crossCampusEnabled = true
  //   2. nexusMode parameter = true (explicitly requested)
  if (nexusMode && requestingStudent.nexus?.crossCampusEnabled) {
    filters.push(
      `(visibility = 'nexus_partners' AND collegeGroupId = '${requestingStudent.collegeGroupId}')`
    );
  }

  // Combine all filters with OR logic
  const meilisearchFilter = filters.map(f => `(${f})`).join(' OR ');

  // MongoDB equivalent using $or
  const mongodbFilter = {
    $or: [
      { visibility: 'public' },
      {
        visibility: 'campus_only',
        campusId: requestingStudent.campusId,
      },
      {
        visibility: 'college_group',
        collegeGroupId: requestingStudent.collegeGroupId,
      },
      ...(nexusMode && requestingStudent.nexus?.crossCampusEnabled
        ? [
            {
              visibility: 'nexus_partners',
              collegeGroupId: requestingStudent.collegeGroupId,
            },
          ]
        : []),
    ],
  };

  return {
    meilisearchFilter,
    mongodbFilter,
  };
}

/**
 * Builds Meilisearch filter string for student search visibility.
 * Stricter than resources — excludes suspended/banned students entirely.
 */
export function buildStudentSearchFilter(
  requestingStudent: {
    campusId: string;
    collegeGroupId: string;
    nexus: { crossCampusEnabled: boolean };
  },
  nexusMode: boolean = false,
  filters?: {
    rankTier?: string;
    minKarma?: number;
  }
): string {
  const parts: string[] = [];

  // Always exclude suspended and banned students
  parts.push("moderationStatus = 'good_standing' OR moderationStatus = 'warning'");

  // Always require complete onboarding
  parts.push("onboardingStatus = 'complete'");

  // Campus filtering
  if (nexusMode && requestingStudent.nexus?.crossCampusEnabled) {
    // Will be handled by campus IN [accessibleCampuses] in SearchService
    // Don't hard-code it here — needs MOU lookup
  } else {
    // Local campus only
    parts.push(`campus = '${requestingStudent.campusId}'`);
  }

  // Optional filters
  if (filters?.rankTier) {
    parts.push(`rankTier = '${filters.rankTier}'`);
  }
  if (filters?.minKarma) {
    parts.push(`karma >= ${filters.minKarma}`);
  }

  return parts.map(p => `(${p})`).join(' AND ');
}
