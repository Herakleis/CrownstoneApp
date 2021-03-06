import { LOG } from '../../logging/Log'

export const user = {
  /**
   *
   * @param options
   * @returns {Promise}
   */
  registerUser: function(options) {
    return this._setupRequest('POST', 'users', {data:{
      email: options.email,
      password: options.password,
      firstName: options.firstName,
      lastName: options.lastName
    }}, 'body');
  },

  /**
   *
   * @param options
   * {
   *   email: string,
   *   password: string,
   *   onUnverified: callback,
   *   onInvalidCredentials: callback,
   *   background: boolean
   * }
   *
   * resolves with the parsed data, rejects with {status: httpStatus, data: data}
   */
  login: function(options) {
    return new Promise((resolve, reject) => {
      let endpoint = 'users/login';

      // accessToken has to be null when attempting a login.
      let prevAccessToken = this.accessToken;
      this.accessToken = null;
      // max ttl (time to live) for the access token is 31556926 (1 year in seconds)
      this._post({ endPoint: endpoint, data:{ email: options.email, password: options.password, ttl: 6*24*3600 } , type:'body'})
        .then((reply) => {
          if (reply.status === 200) {
            resolve(reply.data)
          }
          else {
            this.accessToken = prevAccessToken;
            if (reply.data && reply.data.error && reply.data.error.code) {
              switch (reply.data.error.code) {
                case 'LOGIN_FAILED_EMAIL_NOT_VERIFIED':
                  if (options.onUnverified)
                    options.onUnverified();
                  break;
                case 'LOGIN_FAILED':
                  if (options.onInvalidCredentials)
                    options.onInvalidCredentials();
                  break;
                default:
                  this.__debugReject(reply, reject, options);
              }
            }
            else {
              this.__debugReject(reply, reject, options);
            }
          }
        }).catch((error) => { this._handleNetworkError(error, options, endpoint, undefined, reject); });
    })
  },


  /**
   *
   * @param file {String} --> full path string.
   */
  uploadProfileImage: function(file) {
    return this._uploadImage({endPoint:'/users/{id}/profilePic', path:file, type:'body'})
  },

  /**
   *
   * @param toPath
   */
  downloadProfileImage: function (toPath) {
    return this._download({endPoint:'/users/{id}/profilePic'}, toPath);
  },


  removeProfileImage: function(options : any = {}) {
    return this._setupRequest(
      'DELETE',
      'users/{id}/profilePic',
      { background: options.background }
    );
  },

  /**
   *
   * @returns {*}
   */
  getUserData: function (options : any = {}) {
    return this._setupRequest('GET', '/users/{id}', options);
  },

  /**
   *
   * @param data
   * @param background
   * @returns {Promise}
   */
  updateUserData: function(data, background = true) {
    return this._setupRequest('PUT', '/users/{id}', {data: data, background: background}, 'body');
  },

  /**
   *
   * @param options
   */
  requestVerificationEmail: function(options : any = {}) {
    return this._setupRequest(
      'POST',
      'users/resendVerification',
      { data: { email: options.email }, background: options.background },
      'query'
    );
  },

  /**
   *
   * @param options
   */
  requestPasswordResetEmail: function(options : any = {}) {
    return this._setupRequest(
      'POST',
      'users/reset',
      { data: { email: options.email }, background: options.background },
      'body'
    );
  },

  getKeys: function(options : any = {}) {
    return this._setupRequest(
      'GET',
      'users/{id}/keys',
      options
    );
  },


  enterLocation: function(sphereId, locationId) {
    return this._setupRequest(
      'PUT',
      'users/{id}/currentLocation',
      { sphereId: sphereId, locationId: locationId, background: true }
    );
  },

  // exitLocation: function() {
  //   return this._setupRequest(
  //     'DELETE',
  //     'users/{id}/currentLocation',
  //     { background: true }
  //   );
  // },

};