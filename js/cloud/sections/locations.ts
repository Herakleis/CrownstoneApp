export const locations = {
  getLocations: function (options : any = {}) {
    return this._setupRequest('GET', '/Spheres/{id}/ownedLocations', {...options, data:{filter:{"include":"presentPeople"}}});
  },

  createLocation: function (locationName, icon) {
    return this._setupRequest(
      'POST',
      '/Spheres/{id}/ownedLocations',
      {data: {name: locationName, icon:icon}},
      'body'
    );
  },

  updateLocation: function (locationId, data, background = true) {
    return this._setupRequest(
      'PUT',
      '/Spheres/{id}/ownedLocations/' + locationId,
      {background: background, data: data},
      'body'
    );
  },


  deleteLocation: function(locationId) {
    return this._setupRequest(
      'DELETE',
      '/Spheres/{id}/ownedLocations/' + locationId
    );
  }
};