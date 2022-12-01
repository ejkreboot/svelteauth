import { redirect } from '@sveltejs/kit'

export const load = async () => {
  // we only use this endpoint for the api
  // and don't need to see the page
  throw redirect(302, '/public/landing')
}

export const actions  = {
  default({ cookies }) {
    cookies.set('session', '', {
      path: '/',
      expires: new Date(0),
    })
    throw redirect(302, '/public/landing')
  }
}