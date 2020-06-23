import React, {useEffect, useState} from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import images from 'res/images';
import colors from 'res/colors';
import { connect } from 'react-redux';
import {clearErrorMessage } from 'actions';
import {fr, frh} from 'database/Fire';
import {loadprofile, uploadprofilepic} from '../../../actions/actionProfile';
import {readref, syncref} from '../../../actions/actionFire';
import {navigate} from '../../../navigationRef';
import Spacer from 'components/Spacer';


import ImagePicker from 'react-native-image-picker';
import Uploader from 'database/Uploader';
import {Text, Input, Button} from 'react-native-elements';

const EditProfileScreen = (props) => {
  const userId = fr.uid;
  profile = props.profile;

  [resourcePath, setResourcePath] = useState({});
  [fullname, setFullName] = useState(profile.full_name);
  [bio, setBio] = useState(profile.bio);

  console.log("<--->");
  console.log("EditProfileScreen.profile:");
  console.log(JSON.stringify(profile));
  console.log("<--->");

  console.log("<--->");
  console.log("EditProfileScreen.props.error:");
  console.log(JSON.stringify(props.error));
  console.log("<--->");

  const _loadprofile = (uid)=> props.loadprofile({uid});
  const _uploadprofilepic = (image)=> props.uploadprofilepic({image});
  const readRef = (path, key1, key2) => props.readref({path, key1, key2})
  const syncRef = (path, key1, key2) => props.syncref({path, key1, key2})

  useEffect(() => {
    _loadprofile(userId);
  }, []);

  onRefresh = () => {
    console.log('onRefresh');
  };

  
  selectFile = () => {
    var options = {
      title: 'Select Image',
      customButtons: [
        { 
          name: 'customOptionKey', 
          title: 'Choose file from Custom Option' 
        },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, res => {
      //console.log('Response = ', res);

      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        let source = res;
        setResourcePath(source);
        //console.log("Type: ", resourcePath.type);
        _uploadprofilepic(resourcePath);
      }
    });
  };

  // App.js

cameraLaunch = () => {
  let options = {
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  ImagePicker.launchCamera(options, (res) => {
    //console.log('Response = ', res);

    if (res.didCancel) {
      console.log('User cancelled image picker');
    } else if (res.error) {
      console.log('ImagePicker Error: ', res.error);
    } else if (res.customButton) {
      console.log('User tapped custom button: ', res.customButton);
      alert(res.customButton);
    } else {
      let source = res;
      setResourcePath(source);
    }
  });
}


imageGalleryLaunch = () => {
  let options = {
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  ImagePicker.launchImageLibrary (options, (res) => {
    //console.log('Response = ', res);

    if (res.didCancel) {
      console.log('User cancelled image picker');
    } else if (res.error) {
      console.log('ImagePicker Error: ', res.error);
    } else if (res.customButton) {
      console.log('User tapped custom button: ', res.customButton);
      alert(res.customButton);
    } else {
      let source = res;
      setResourcePath(source);      
    }
  });
}


uploadIt = async () => {    
    /*const {height, width, type, uri} = resourcePath;
    blob = await uriToBlob(uri);
    console.log("blob.type: ", blob.type);    
    pics ={
      full: blob,
      thumb: blob
    }
    const postId = await frh.uploadNewPic(pics.full, pics.thumb, "currentFile_name", "imageCaption");  
    console.log("Post-id: ", postId);*/

    /*pics = await Uploader._generateImages(resourcePath);
    const postId = await frh.uploadNewPic(pics.full, pics.thumb, "testimagename", "test image caption");  
    console.log("Post-id: ", postId);*/

    pics = await Uploader._generateImages(resourcePath);
    const profile_url = await frh.uploadProfilePic(pics.thumb);  
    console.log("profile_url: ", profile_url);

}

  return (

      


    <View style={styles.container}>

      <View style={styles.profileImageSection}>
          <TouchableOpacity onPress={this.selectFile}>
            <Image source={{uri: profile.profile_picture}} style={styles.profileImage} />          
          </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={this.selectFile}>
            <Text>Profil Fotoğrafını Değiştir</Text>
      </TouchableOpacity>

      <Input 
        label="Name" 
        value={profile.full_name}
        onChangeText={setFullName}
        autoCapitalize="none"
        autoCorrect={false}
        />
        <Spacer />

        <Input 
        label="Bio" 
        value={profile.bio}
        onChangeText={setBio}
        autoCapitalize="none"
        autoCorrect={false}
        />
        <Spacer />
        
        {props.error ? <Text style={styles.errorMessage}>{props.error}</Text> : null}
        
        <Spacer>
            <Button title="Sign Up" onPress={()=>{
                console.log("clicked Signup submit");
                props.signup({email, password, fullname});
            }}/>
        </Spacer>
      

      <View style={styles.container}>      
        <Image
          source={{ uri: resourcePath.uri }}
          style={{ width: 200, height: 200 }}
        />
        <TouchableOpacity onPress={this.selectFile} style={styles.button}  >
            <Text style={styles.buttonText}>Select File</Text>
        </TouchableOpacity>       
        <TouchableOpacity onPress={this.cameraLaunch} style={styles.button}  >
            <Text style={styles.buttonText}>Launch Camera Directly</Text>
        </TouchableOpacity>       
        <TouchableOpacity onPress={this.imageGalleryLaunch} style={styles.button}  >
              <Text style={styles.buttonText}>Launch Image Gallery Directly</Text>
        </TouchableOpacity>

        <Button title="Upload" onPress={this.uploadIt}/>
      </View>
    </View>
  );

  /*return (
    <View style={styles.bioContainer}>
      <View style={styles.profileImageSection}>
          <TouchableOpacity onPress={this.selectFile}>
            <Image source={{uri: profile.profile_picture}} style={styles.profileImage} />          
          </TouchableOpacity>
      </View>
      <TouchableOpacity>
            <Text>Profil Fotoğrafını Değiştir</Text>
      </TouchableOpacity>
    </View>
  );*/
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  button: {
    width: 250,
    height: 60,
    backgroundColor: '#3740ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginBottom:12    
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 15,
    color: '#fff'
  },
  errorMessage: {
      fontSize: 16,
      color: 'red',
      marginLeft: 15,
      marginTop: 15
  },
  //container: { backgroundColor: colors.tabBackground, flex: 1, },
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

  console.log("State in EditProfileScreen.mapStateToProps: ")
  console.log(JSON.stringify(state));
  return {
      profile: "data" in state.profileReducer ? state.profileReducer.data : {},
      error: "error" in state.profileReducer ? state.profileReducer.error :  null
    }
}

const mapDispatchToProps = {
  loadprofile,
  uploadprofilepic,
  readref, syncref   
}; 

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileScreen);

//export default EditProfileScreen;