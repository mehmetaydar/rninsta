import React, {useEffect} from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import images from 'res/images';
import colors from 'res/colors';
import { connect } from 'react-redux';
import {clearErrorMessage } from 'actions';
import {fr, frh} from 'database/Fire';
import {loadprofile, nbfollowers, nbfollowing, nbposts,
  loadprofileposts} from '../../../actions/actionProfile';

import {readref, syncref} from '../../../actions/actionFire';

const ProfileScreen = (props) => {
  //const {fr, frh} = {fr: Fire.fr, frh: Fire.frh};
  const userId = fr.uid;
  profile = props.profile;
  posts = props.posts;

  console.log("<--->");
  console.log("ProfileScreen.profile:");
  console.log(JSON.stringify(profile));
  console.log("<--->");

  console.log("<--->");
  console.log("ProfileScreen.posts:");
  console.log(JSON.stringify(posts));
  console.log("<--->");

  const _loadprofile = (uid)=> props.loadprofile({uid});
  const _nbposts = (uid)=> props.nbposts({uid});
  const _nbfollowing = (uid)=> props.nbfollowing({uid});
  const _nbfollowers = (uid)=> props.nbfollowers({uid});
  const _loadprofileposts = (uid)=> props.loadprofileposts({uid});

  const readRef = (path, key1, key2) => props.readref({path, key1, key2})
  const syncRef = (path, key1, key2) => props.syncref({path, key1, key2})

  useEffect(() => {
    //console.log(frh.test());
    _loadprofileposts(userId);
    /*_loadprofile(userId);
    _nbposts(userId);    
    _nbfollowing(userId);
    _nbfollowers(userId);*/

     //syncRef(`/people/${userId}/full_name`, 'profile', 'full_name');
     //readRef(`/people/${userId}/full_name`, 'profile', 'full_name');     
  }, []);

  onRefresh = () => {
    console.log('onRefresh');
  };

  //frh.cancelAllSubscriptions(); //clear

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
        <Text style={styles.name}>{profile.full_name}</Text>
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

  console.log("State in ProfileScreen.mapStateToProps: ")
  console.log(JSON.stringify(state));
  return {
      profile: "data" in state.profileReducer ? state.profileReducer.data : {},
      posts: "posts" in state.profileReducer ? state.profileReducer.posts : {},
      error: "error" in state.profileReducer ? state.profileReducer.error :  null
    }
}

const mapDispatchToProps = {
  loadprofile,
  nbposts, nbfollowers, nbfollowing,
  loadprofileposts,
  readref, syncref   
}; 

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);

//export default ProfileScreen;