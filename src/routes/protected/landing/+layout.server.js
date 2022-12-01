export const load = async ({ locals }) => {
  return {
    email: locals.user.email
  }
}