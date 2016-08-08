const fetch = require('node-fetch');
const Promise = require("promise");


/**
 *
 * ALL KEYS IN HERE ARE ONLY USED FOR TESTING PURPOSES. THERE IS NO PRIVATE DATE HERE.
 *
 * @type {{Accept: string, Content-Type: string}}
 */

// fucking fetch lib uses its own promises!
fetch.Promise = Promise;

let token = '5nEe9TjFvYRWlUCK0MdcCJczl4CLwjyVCOhHNWpg4qpBVBB7ERZVDDdnxeiiDP3d';
let userId = '5747122cfb25ed03000bdc70';

let defaultHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};
let handleInitialReply = (response) => {
  STATUS = response.status;
  if (response &&
    response.headers &&
    response.headers.map &&
    response.headers.map['content-type'] &&
    response.headers.map['content-type'].length > 0) {
    if (response.headers.map['content-type'][0].substr(0,16) === 'application/json') {
      if (response.headers.map['content-length'] &&
        response.headers.map['content-length'].length > 0 &&
        response.headers.map['content-length'][0] == 0) {
        return '';
      }
      return response.json(); // this is a promise
    }
  }
  return response.text(); // this is a promise
};



fetch(
  'http://crownstone-cloud.herokuapp.com/api/users/' + userId + '/groups?access_token=' + token,
  {method: 'GET',headers: defaultHeaders,body: ''})
  .then(handleInitialReply)
  .then((result) => {
    let data = JSON.parse(result);
    let groupIds = []
    data.forEach((group) => {
      groupIds.push(group.id)
    })
    console.log(data, groupIds)
    return groupIds
  })
  .then((groupIds) => {
    return new Promise((resolve, reject) => {
    console.log('deleting stones from ',groupIds)
    let promiseArray = [];
    groupIds.forEach((groupId) => {
      promiseArray.push(removeStones(groupId))
    });
    Promise.all(promiseArray)
      .then(() => {
        console.log("deleting groups")
        let promiseArray = [];
        groupIds.forEach((groupId) => {
          promiseArray.push(deleteGroup(groupId))
        });
        return Promise.all(promiseArray)
      })
      .then(resolve)
    })
  })
  .then(() => {
    console.log("FINISHED")
  }).done()

function deleteGroup (groupId) {
  return new Promise((resolve, reject) => {
    let base = 'http://crownstone-cloud.herokuapp.com/api/Groups/$id$?access_token=' + token;
    return fetch(base.replace("$id$", groupId),{method: 'DELETE', headers: defaultHeaders, body: ''})
      .then(handleInitialReply)
      .then((results) => {
        // console.log(results);
        resolve()
      }).done()
  })
}

function removeStones(groupId) {
  console.log("removeStones", groupId)
  return new Promise((resolve, reject) => {
    let base = 'http://crownstone-cloud.herokuapp.com/api/Groups/$id$/ownedStones?access_token=' + token;
    fetch(base.replace("$id$", groupId), {method: 'GET', headers: defaultHeaders, body: ''})
      .then(handleInitialReply)
      .then((results) => {
        let data = JSON.parse(results);
        // console.log("stonedata:",data)
        let promiseArray = [];
        data.forEach((stone) => {
          promiseArray.push(deleteStone(stone.id))
        });
        return Promise.all(promiseArray);
      })
      .then(resolve).done()
  });
}

function deleteStone(stoneId) {
  console.log('delete stone', stoneId)
  return new Promise((resolve, reject) => {
    let base = 'http://crownstone-cloud.herokuapp.com/api/Stones/$id$?access_token=' + token;
    return fetch(base.replace("$id$", stoneId), {method: 'DELETE', headers: defaultHeaders, body: ''})
      .then(handleInitialReply)
      .then((results) => {
        // console.log(results);
        resolve()
      }).done()
  });
}