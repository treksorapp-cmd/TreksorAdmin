/** Treksor / The Architect — canonical product language and pillar identity.
 * Keep aligned with TreksorApp/lib/pillar-navigation.ts.
 * Icons are Lucide names on web; mobile equivalents are Ionicons.
 */
export const treksorIdentity = {
  brand: "Treksor",
  productArea: "Your Journey",
  productAreaDescription: "Your personal development journey",
  // Never use "Ecosystem" as a user-facing product section.
  pillars: {
    body: { label: "Body", icon: "dumbbell", mobileIcon: "barbell-outline", description: "Strength & movement" },
    mind: { label: "Mind", icon: "brain", mobileIcon: "brain", description: "Clarity & focus" },
    balance: { label: "Balance", icon: "leaf", mobileIcon: "leaf-outline", description: "Recovery & presence" },
    purpose: { label: "Purpose", icon: "compass", mobileIcon: "compass-outline", description: "Direction & intention" },
  },
  tools: ["Today", "Mentor", "Progress", "Community"],
} as const;
