 /*
 Firestore implementation of Firebase helper from friendly-pix
 */


'use strict';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import latinize from 'latinize';

/**
 * Handles all Firebase interactions.
 */
export default class FireHelper {
  /**
   * Number of posts loaded initially and per page for the feeds.
   * @return {number}
   */
  static get POSTS_PAGE_SIZE() {
    return 3;
  }

  /**
   * Number of posts loaded initially and per page for the User Profile page.
   * @return {number}
   */
  static get USER_PAGE_POSTS_PAGE_SIZE() {
    return 6;
  }

  /**
   * Number of posts loaded initially and per page for the hashtag search page.
   * @return {number}
   */
  static get HASHTAG_PAGE_POSTS_PAGE_SIZE() {
    return 9;
  }

  /**
   * Number of posts comments loaded initially and per page.
   * @return {number}
   */
  static get COMMENTS_PAGE_SIZE() {
    return 3;
  }

  /**
   * Initializes this Firebase facade.
   * @constructor
   */
  constructor() {
    // Firebase SDK.
    this.database = firebase.database();
    this.storage = firebase.storage();
    this.auth = firebase.auth();

    // Firebase references that are listened to.
    this.firebaseRefs = [];
  }

  /**
   * For tests.
   */
  test(uid) {
    console.log("This is test");
    this.cancelAllSubscriptions();
  }


  /**
   * Turns off all Firebase listeners.
   */
  cancelAllSubscriptions() {
    this.firebaseRefs.forEach((ref) => ref.off());
    this.firebaseRefs = [];
  }

  /**
   * +Saves or updates public user data in Firebase (such as image URL, display name...).
   */
  updatePublicProfile() {
    let user = firebase.auth().currentUser;
    let displayName = user.displayName;
    let imageUrl = user.photoURL;

    // If the main profile Pic is an expiring facebook profile pic URL we'll update it automatically to use the permanent graph API URL.
    if (imageUrl && (imageUrl.indexOf('lookaside.facebook.com') !== -1 || imageUrl.indexOf('fbcdn.net') !== -1)) {
      // Fid the user's Facebook UID.
      const facebookUID = user.providerData.find((providerData) => providerData.providerId === 'facebook.com').uid;
      imageUrl = `https://graph.facebook.com/${facebookUID}/picture?type=large`;
      user.updateProfile({photoURL: imageUrl}).then(() => {
        console.log('User profile updated.');
      });
    }

    if (!displayName) {
      displayName = 'Anonymous';
    }
    let searchFullName = displayName.toLowerCase();
    let searchReversedFullName = searchFullName.split(' ').reverse().join(' ');
    try {
      searchFullName = latinize(searchFullName);
      searchReversedFullName = latinize(searchReversedFullName);
    } catch (e) {
      console.error(e);
    }

    this.getPrivacySettings(user.uid).then((snapshot) => {
      let socialEnabled = false;
      if (snapshot.val() !== null) {
        socialEnabled = snapshot.val().social;
      }
      else//By default, we set socialEnabled=true
        socialEnabled = true;

      const updateData = {
        profile_picture: imageUrl || null,
        full_name: displayName,
      };

      if (socialEnabled) {
        updateData._search_index = {
          full_name: searchFullName,
          reversed_full_name: searchReversedFullName,
        };
      };
      return this.database.ref(`/people/${user.uid}`).update(updateData).then(() => {
        console.log('Public profile updated.');
      });
    });
  }
  
  /**
   * Fetches the user's privacy settings.
   */
  getPrivacySettings(uid) {
    return this.database.ref(`/privacy/${uid}`).once('value');
  }

  /**
   * Paginates posts from the user's posts feed.
   *
   * Fetches a page of `USER_PAGE_POSTS_PAGE_SIZE` posts from the user's posts feed.
   *
   * We return a `Promise` which resolves with an Map of posts and a function to the next page or
   * `null` if there is no next page.
   */
  async getUserFeedPosts(uid) {
    return this._getPaginatedFeed(`/people/${uid}/posts`,
        FireHelper.USER_PAGE_POSTS_PAGE_SIZE, null, true);
  }

    /**
   * Paginates entries from the given feed.
   *
   * Fetches a page of `pageSize` entries from the given feed.
   *
   * If provided we'll return entries that were posted before (and including) `earliestEntryId`.
   *
   * We return a `Promise` which resolves with an Map of entries and a function to the next page or
   * `null` if there is no next page.
   *
   * If needed the posts details can be fetched. This is useful for shallow post feeds like the user
   * home feed and the user post feed.
   * @private
   */
  _getPaginatedFeed(uri, pageSize, earliestEntryId = null, fetchPostDetails = false) {
    console.log('Fetching entries from', uri, 'start at', earliestEntryId, 'page size', pageSize);
    let ref = this.database.ref(uri);
    if (earliestEntryId) {
      ref = ref.orderByKey().endAt(earliestEntryId);
    }
    // We're fetching an additional item as a cheap way to test if there is a next page.
    return ref.limitToLast(pageSize + 1).once('value').then((data) => {
      const entries = data.val() || {};

      // Figure out if there is a next page.
      let nextPage = null;
      const entryIds = Object.keys(entries);
      if (entryIds.length > pageSize) {
        delete entries[entryIds[0]];
        const nextPageStartingId = entryIds.shift();
        nextPage = () => this._getPaginatedFeed(
            uri, pageSize, nextPageStartingId, fetchPostDetails);
      }
      if (fetchPostDetails) {
        // Fetch details of all posts.
        const queries = entryIds.map((postId) => this.getPostData(postId));
        // Since all the requests are being done one the same feed it's unlikely that a single one
        // would fail and not the others so using Promise.all() is not so risky.
        return Promise.all(queries).then((results) => {
          const deleteOps = [];
          results.forEach((result) => {
            if (result.val()) {
              entries[result.key] = result.val();
            } else {
              // We encountered a deleted post. Removing permanently from the feed.
              delete entries[result.key];
              deleteOps.push(this.deleteFromFeed(uri, result.key));
            }
          });
          if (deleteOps.length > 0) {
            // We had to remove some deleted posts from the feed. Lets run the query again to get
            // the correct number of posts.
            return this._getPaginatedFeed(uri, pageSize, earliestEntryId, fetchPostDetails);
          }
          return {entries: entries, nextPage: nextPage};
        });
      }
      return {entries: entries, nextPage: nextPage};
    });
  }

  /**
   * Deletes the given postId entry from the user's home feed.
   */
  deleteFromFeed(uri, postId) {
    return this.database.ref(`${uri}/${postId}`).remove();
  }

  /**
   * Subscribes to receive updates to a user feed. The given `callback` function gets called for
   * each new post to a user page post feed.
   *
   * If provided we'll only listen to posts that were posted after `latestPostId`.
   */
  subscribeToUserFeed(uid, callback, latestPostId) {
    return this._subscribeToFeed(`/people/${uid}/posts`, callback,
        latestPostId, true);
  }

  /**
   * Subscribes to receive updates to the given feed. The given `callback` function gets called
   * for each new entry on the given feed.
   *
   * If provided we'll only listen to entries that were posted after `latestEntryId`. This allows to
   * listen only for new feed entries after fetching existing entries using `_getPaginatedFeed()`.
   *
   * If needed the posts details can be fetched. This is useful for shallow post feeds.
   * @private
   */
  _subscribeToFeed(uri, callback, latestEntryId = null, fetchPostDetails = false) {
    // Load all posts information.
    let feedRef = this.database.ref(uri);
    if (latestEntryId) {
      feedRef = feedRef.orderByKey().startAt(latestEntryId);
    }
    feedRef.on('child_added', (feedData) => {
      if (feedData.key !== latestEntryId) {
        if (!fetchPostDetails) {
          callback(feedData.key, feedData.val());
        } else {
          this.database.ref(`/posts/${feedData.key}`).once('value').then(
              (postData) => callback(postData.key, postData.val()));
        }
      }
    });
    this.firebaseRefs.push(feedRef);
  }

  /**
   * Fetches a single post data.
   */
  getPostData(postId) {
    return this.database.ref(`/posts/${postId}`).once('value');
  }

  /**
   * Uploads a new Picture to Cloud Storage and adds a new post referencing it.
   * This returns a Promise which completes with the new Post ID.
   */
  uploadNewPic(pic, thumb, fileName, text) {
    console.log("uploadNewPic");
    // Get a reference to where the post will be created.
    const newPostKey = this.database.ref('/posts').push().key;

    console.log("New-post-key: ", newPostKey)
    console.log("upload-path: ", `${this.auth.currentUser.uid}/full/${newPostKey}/${fileName}`);
    // Start the pic file upload to Cloud Storage.
    console.log(1);
    const picRef = this.storage.ref(`${this.auth.currentUser.uid}/full/${newPostKey}/${fileName}`);
    console.log(2);
    const metadata = {
      contentType: pic.type,
    };
    console.log(3);
    const picUploadTask = picRef.put(pic, metadata).then((snapshot) => {
      console.log('New pic uploaded. Size:', snapshot.totalBytes, 'bytes.');
      return snapshot.ref.getDownloadURL().then((url) => {
        console.log('File available at', url);
        return url;
      });
    }).catch((error) => {
      console.error('Error while uploading new pic', error);
    });
    console.log(4);
    // Start the thumb file upload to Cloud Storage.
    const thumbRef = this.storage.ref(`${this.auth.currentUser.uid}/thumb/${newPostKey}/${fileName}`);
    const tumbUploadTask = thumbRef.put(thumb, metadata).then((snapshot) => {
      console.log('New thumb uploaded. Size:', snapshot.totalBytes, 'bytes.');
      return snapshot.ref.getDownloadURL().then((url) => {
        console.log('File available at', url);
        return url;
      });
    }).catch((error) => {
      console.error('Error while uploading new thumb', error);
    });

    return Promise.all([picUploadTask, tumbUploadTask]).then((urls) => {
      // Once both pics and thumbnails has been uploaded add a new post in the Firebase Database and
      // to its fanned out posts lists (user's posts and home post).
      const update = {};
      update[`/posts/${newPostKey}`] = {
        full_url: urls[0],
        thumb_url: urls[1],
        text: text,
        client: 'mobile',
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        full_storage_uri: picRef.toString(),
        thumb_storage_uri: thumbRef.toString(),
        author: {
          uid: this.auth.currentUser.uid,
          full_name: this.auth.currentUser.displayName || 'Anonymous',
          profile_picture: this.auth.currentUser.photoURL || null,
        },
      };
      update[`/people/${this.auth.currentUser.uid}/posts/${newPostKey}`] = true;
      update[`/feed/${this.auth.currentUser.uid}/${newPostKey}`] = true;
      return this.database.ref().update(update).then(() => newPostKey);
    }); 
  }  

  /**
   * Uploads a new Profile Picture to Cloud Storage and adds its ref to auth and people.
   * This returns a Promise which completes with the new storage url.
   */
  uploadProfilePic(pic) {
    let user = firebase.auth().currentUser;
    console.log("uploadProfilePic");
    console.log("upload-path: ", `${this.auth.currentUser.uid}/profile/profile-pic`);
    // Start the pic file upload to Cloud Storage.
    console.log(1);
    const picRef = this.storage.ref(`${this.auth.currentUser.uid}/profile/profile-pic`);
                   //this.storage.ref(`${this.auth.currentUser.uid}/full/${newPostKey}/${fileName}`);
    console.log(2);
    const metadata = {
      contentType: pic.type,
    };
    console.log(3);
    const picUploadTask = picRef.put(pic, metadata).then((snapshot) => {
      console.log('New pic uploaded. Size:', snapshot.totalBytes, 'bytes.');
      return snapshot.ref.getDownloadURL().then((url) => {
        console.log('File available at', url);
        return url;
      });
    }).catch((error) => {
      console.error('Error while uploading new pic', error);
    });
    console.log(4);

    return Promise.all([picUploadTask]).then((urls) => {
      const url = urls[0];
      const update = {};

      return new Promise((resolve, reject) => {
        user.updateProfile({photoURL: url}).then(() => {
          console.log('User profile updated.');
          update[`/people/${this.auth.currentUser.uid}/profile_picture`] = url;
          this.database.ref().update(update).then(() => resolve(url));
        });
      });
      
    }); 
  }


};