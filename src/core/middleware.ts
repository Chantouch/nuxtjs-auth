import { routeOption, getMatchedComponents, normalizePath } from '../utils'

export default async function authMiddleware (ctx) {
  // Disable middleware if options: { auth: false } is set on the route
  if (routeOption(ctx.route, 'auth', false)) {
    return
  }

  // Disable middleware if no route was matched to allow 404/error page
  const matches = []
  const Components = getMatchedComponents(ctx.route, matches)
  if (!Components.length) {
    return
  }

  const pageIsInMode = mode => routeOption(ctx.route, 'auth', mode)
  const defaultStrategies: string[] = ctx.$auth.options.defaultStrategies
  defaultStrategies.forEach((strategy: string) => {
    if (ctx.route.name.startsWith(strategy)) {
      ctx.$auth.$storage.setState('strategy', strategy)
      ctx.$auth.$storage.setUniversal('strategy', strategy)
      ctx.$auth.setStrategy(strategy)
    }
  })
  const token = ctx.$auth.strategy.token.get()
  ctx.$auth.strategy.token.set(token)
  const { login, callback } = ctx.$auth.options.redirect
  const insidePage = page => normalizePath(ctx.route.path) === normalizePath(page)
  if (ctx.$auth.$state.loggedIn) {
    // -- Authorized --
    if (!login || insidePage(login) || pageIsInMode('guest')) {
      ctx.$auth.redirect('home')
    }

    // Perform scheme checks.
    const { tokenExpired, refreshTokenExpired, isRefreshable } = ctx.$auth.check(true)

    // Refresh token has expired. There is no way to refresh. Force reset.
    if (refreshTokenExpired) {
      ctx.$auth.reset()
    } else if (tokenExpired) {
      // Token has expired. Check if refresh token is available.
      if (isRefreshable) {
        // Refresh token is available. Attempt refresh.
        await ctx.$auth.refreshTokens()
      } else {
        // Refresh token is not available. Force reset.
        ctx.$auth.reset()
      }
    }

    // -- Guest --
    // (Those passing `callback` at runtime need to mark their callback component
    // with `auth: false` to avoid an unnecessary redirect from callback to login)
  } else if (!pageIsInMode('guest') && (!callback || !insidePage(callback))) {
    ctx.$auth.redirect('login')
  }
}
