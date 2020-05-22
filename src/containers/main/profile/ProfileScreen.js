import React, {useEffect} from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import images from 'res/images';
import colors from 'res/colors';
import { connect } from 'react-redux';
import {clearErrorMessage } from 'actions';
import {fr, frh} from 'database/Fire';
import {readref, syncref} from '../../../actions/actionFire';

const ProfileScreen = (props) => {
  //const {fr, frh} = {fr: Fire.fr, frh: Fire.frh};
  const userId = fr.uid;
  profile = props.profile;

  console.log("<--->");
  console.log("ProfileScreen.profile:");
  console.log(JSON.stringify(profile));
  console.log("<--->");

  function readRef(path, key1, key2) {
    props.readref({path, key1, key2});
  };
  function syncRef(path, key1, key2) {
    props.syncref({path, key1, key2});
  };
  useEffect(() => {
    
    syncRef(`/people/${userId}/full_name`, 'profile', 'full_name');
    //readRef(`/people/${userId}/full_name`, 'profile', 'full_name');
    //readRef(`/people/${userId}/url`, 'profile', 'url');
    //readRef(`/people/${userId}/bio`, 'profile', 'bio');
    //props.readref({path: `/people/${userId}/full_name`, key1: 'profile', key2: 'full_name'});
    //props.readref({path: `/people/${userId}/url`, key1: 'profile', key2: 'url'});
    //props.readref({path: `/people/${userId}/bio`, key1: 'profile', key2: 'bio'});
    /*async function loadMessages() {
      await props.loadMessages(binId);
    }
    loadMessages();*/
  }, []);

  onRefresh = () => {
    console.log('onRefresh');
  };

  //frh.cancelAllSubscriptions(); //clear

  const profileData = {
    full_name: '', //'Zafer AYAN',
    url: '',
    bio: '',
    profile_picture: '',
    statistics: {
      posts: null,
      followers: null,
      following: null
    }
  };

  //instead tie this to redux
/*  const [num, setNum] = useState(0);
  // Load user's profile.
  frh.loadUserProfile(userId).then((snapshot) => {
    const userInfo = snapshot.val();
    if (userInfo) {
      profileData.profile_picture =  userInfo.profile_picture;
      profileData.full_name =  userInfo.full_name;
      console.log(profileData.full_name);
    }     
  });*/
  
  //instead directly get nbFollowers under people/uid since it will be updated through cloud functions
  //I believe they should be reduxed, get three of them together under one redux action, + plus the profile info
  // Lod user's number of followers.
  /*frh.registerForFollowersCount(userId,
    (nbFollowers) => { 
            profileData.statistics.followers= nbFollowers; 
            console.log(profileData.statistics.followers)
            setNum(profileData.statistics.followers);
      });

    
  // Lod user's number of followed users.
  frh.registerForFollowingCount(userId,
      (nbFollowed) => profileData.statistics.following = nbFollowed )

  // Lod user's number of posts.
  frh.registerForPostsCount(userId,
      (nbPosts) => profileData.statistics.posts = nbPosts )
  */

  const dataSource = [{ key: '1' }, { key: '2' }, { key: '3' }, { key: '4' }, { key: '5' }, { key: '6' }, { key: '7' }, { key: '8' }, { key: '9' }, { key: '10' }, { key: '11' }, { key: '12' }, { key: '13' },];
  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ flex: 1, aspectRatio: 1 }}>
        <Image style={{ flex: 1 }} resizeMode='cover' source={{ uri: 'https://picsum.photos/512' }}></Image>
      </TouchableOpacity>
    );
  }

  renderProfileHeader = () => {
    return (
      <View style={styles.bioContainer}>
        <View style={styles.profileImageSection}>
          <Image source={profile.profile_picture} style={styles.profileImage} />
          <View style={{ alignItems: 'center' }} >
            <Text style={styles.statisticsValue}>{profile.nbposts}</Text>
            <Text style={styles.statisticsTitle}>Gönderiler</Text>
          </View>
          <View style={{ alignItems: 'center' }} >
            <Text style={styles.statisticsValue}>{profile.nbfollowers}</Text>
            <Text style={styles.statisticsTitle}>Takipçi</Text>
          </View>
          <View style={{ alignItems: 'center' }} >
            <Text style={styles.statisticsValue}>{profile.nbfollowing}</Text>
            <Text style={styles.statisticsTitle}>Takip</Text>
          </View>
        </View>
        <Text style={styles.name}>{props.profile.full_name}</Text>
        <Text style={styles.bio}>{profile.bio}</Text>
        <Text style={styles.link} onPress={() => Linking.openURL(profile.url)}>
          {profile.url}
        </Text>
        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileText}>Profili Düzenle</Text>
        </TouchableOpacity>

      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={dataSource}
        renderItem={this.renderItem}
        keyExtractor={(item) => item.key}
        numColumns={3}
        ListHeaderComponent={this.renderProfileHeader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: colors.tabBackground, flex: 1, },
  bioContainer: { padding: 20, },
  profileImageSection: { alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', },
  profileImage: { width: 75, height: 75, borderRadius: 75, },
  statisticsValue: { color: colors.text, fontSize: 18, fontWeight: 'bold', },
  statisticsTitle: { color: colors.text, fontSize: 15, fontWeight: 'normal' },
  name: { color: colors.text, marginTop: 10, },
  bio: { color: colors.text, marginTop: 0, },
  link: { color: colors.link, },
  editProfileButton: { marginTop: 10, backgroundColor: colors.background, borderColor: colors.seperator, borderRadius: 3, borderWidth: 1, padding: 5, },
  editProfileText: { color: colors.text, textAlign: 'center', fontWeight: 'normal' },
});

//{profile: {full_name, url, bio, profile_picture, nbposts, npfollowers, nbfollowing}    
const mapStateToProps = (state) => {
  /*console.log("profile screen mapStateToProps.state:");
  const {fireReducer: {profile} }= state;
  console.log("profile:");
  console.log(JSON.stringify(profile));
  return {profile};*/

  console.log(JSON.stringify(state));
  return {
      profile: state.fireReducer.profile
    }
}

const mapDispatchToProps = {
  clearErrorMessage,
  readref, syncref     
}; 

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);

//export default ProfileScreen;