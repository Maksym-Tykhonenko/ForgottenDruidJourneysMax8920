// Central registry for non-place artwork (illustrations + onboarding plates).
// Keeping every static require in one module avoids scattering asset paths
// across screens and makes swapping art trivial.

export const Illustrations = {
  quizPortal: require('../../irdeimgs/elements/bloktiwhquestion.png'),
  favoriteHeart: require('../../irdeimgs/elements/bookWithHeart.png'),
  archiveDoor: require('../../irdeimgs/elements/doors.png'),
  sage: require('../../irdeimgs/elements/personaj.png'),
};

export const OnboardingPlates = [
  require('../../irdeimgs/jaydionbs/onboard1.png'),
  require('../../irdeimgs/jaydionbs/onboard2.png'),
  require('../../irdeimgs/jaydionbs/onboard3.png'),
  require('../../irdeimgs/jaydionbs/onboard4.png'),
];
