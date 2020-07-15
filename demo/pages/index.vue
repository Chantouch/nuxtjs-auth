<template>
  <div>
    <b-jumbotron class="text-center">
      <h3>Welcome to Nuxt auth example</h3>
      This demo is using auth-module v{{ version }}
      <div class="mt-1">
        <template v-if="$auth.$state.loggedIn">
          <b-btn class="ml-3" variant="info" to="/admin/secure">
            Admin Secure
          </b-btn>
          <b-btn class="ml-3" variant="primary" to="/staff/secure">
            Staff Secure
          </b-btn>
          <b-btn class="ml-3" variant="danger" @click="$auth.logout()">
            Logout
          </b-btn>
        </template>
        <template v-else>
          <b-btn variant="success" to="/admin/login">
            Admin Login
          </b-btn>
          <b-btn variant="info" to="/staff/login">
            Staff Login
          </b-btn>
        </template>
      </div>
    </b-jumbotron>

    <div>
      User status:
      <b-badge>{{ $auth.$state.loggedIn ? 'Logged In' : 'Guest' }}</b-badge>
    </div>
  </div>
</template>

<script>
import { version } from '../../package.json'

export default {
  computed: {
    version: () => version
  }
}
</script>
