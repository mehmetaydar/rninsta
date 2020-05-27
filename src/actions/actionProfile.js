/*
Anything that starts with s_ means it is an action that is suppose to hit SAGA
Anything that starts with r_ means it is an action that is suppose to hit REDUCER
*/
import {action} from './actionUtil';
export const types = {    
    s_loadprofile: "s_loadprofile",
    r_error: "r_error",
    r_profileinfo: "r_profileinfo",
    r_profile_nb: "r_profile_nb",
    s_profile_nbposts: "s_profile_nbposts",
    s_profile_nbfollowers: "s_profile_nbfollowers",
    s_profile_nbfollowing: "s_profile_nbfollowing",
    s_profile_posts: "s_profile_posts",
    r_profile_posts: "r_profile_posts"    
}

export const loadprofile = ({uid}) => action(types.s_loadprofile, {uid});
export const nbposts = ({uid}) => action(types.s_profile_nbposts, {uid});
export const nbfollowers = ({uid}) => action(types.s_profile_nbfollowers, {uid});
export const nbfollowing = ({uid}) => action(types.s_profile_nbfollowing, {uid});
export const loadprofileposts = ({uid}) => action(types.s_profile_posts, {uid});