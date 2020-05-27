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
  getUserFeedPosts(uid) {
    return this._getPaginatedFeed(`/people/${uid}/posts`,
        FirebaseHelper.USER_PAGE_POSTS_PAGE_SIZE, null, true);
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

};
