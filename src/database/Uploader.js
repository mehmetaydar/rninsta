/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
import ImageResizer from 'react-native-image-resizer';

/**
 * Handles uploads of new pics.
 */
export default class Uploader {
  /**
   * @return {number}
   */
  static get FULL_IMAGE_SPECS() {
    return {
      maxDimension: 1280,
      quality: 0.9,
    };
  }

  /**
   * @return {number}
   */
  static get THUMB_IMAGE_SPECS() {
    return {
      maxDimension: 640,
      quality: 0.7,
    };
  }

  /**
   * Inititializes the pics uploader/post creator.
   * @constructor
   */
  constructor() {
  }

  /**
   * Returns a Canvas containing the given image scaled down to the given max dimension.
   * @private
   * @static
   */
  static _getScaledImageDimensions(image, maxDimension) {
    let dim ={
      width: image.width,
      height: image.height
    };

    if (image.width > maxDimension ||
      image.height > maxDimension) {
      if (image.width > image.height) {
        dim.width = maxDimension;
        dim.height = maxDimension * image.height / image.width;
      } else {
        dim.width = maxDimension * image.width / image.height;
        dim.height = maxDimension;
      }
    }
    //console.log("dim.width: ", dim.width);
    //console.log("dim.height: ", dim.height);
    return dim;
  }

  /*
    convert from camera image.uri to Blob
  */
  static _uriToBlob = async (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        // return the blob
        resolve(xhr.response);
      };    
      xhr.onerror = function() {
        // something went wrong
        reject(new Error('uriToBlob failed'));
      };
      // this helps us get a blob
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  }

  static _resizeImage = async(uri, newWidth, newHeight, quality=100, compressFormat='JPEG', rotation=0, outputPath=null) => {
    return new Promise((resolve, reject) => {
      ImageResizer.createResizedImage(uri, newWidth, newHeight, compressFormat, quality)
      .then(({uri}) => {
        //console.log("new _resized _uri: ",  uri);
        resolve(uri);
      })
      .catch(err => {
        console.log("Error on Uploader._resizeImage: ", err);
        /*return Alert.alert(
          'Unable to resize the photo',
          'Check the console for full the error message',
        );*/
        resolve(uri);//return original image if failed
      });
    });  
  }

  /**
   * Generates the full size image and image thumb using canvas and returns them in a promise.
   */
  static _generateImages = async(image) => {
    //console.log("original image uri: ", image.uri);
    const maxFullDimension = Uploader.FULL_IMAGE_SPECS.maxDimension;
    const maxThumbDimension = Uploader.THUMB_IMAGE_SPECS.maxDimension;

    const dimFull = Uploader._getScaledImageDimensions(image, maxFullDimension);

    //console.log("dimFull.width: ", dimFull.width);
    //console.log("dimFull.height: ", dimFull.height);

    const dimThumb = Uploader._getScaledImageDimensions(image, maxThumbDimension);

    //console.log("dimThumb.width: ", dimThumb.width);
    //console.log("dimThumb.height: ", dimThumb.height);

    const uriFull = await Uploader._resizeImage(image.uri, dimFull.width, dimFull.height, Uploader.FULL_IMAGE_SPECS.quality);
    //console.log("uriFull: ", uriFull);
    const uriThumb = await Uploader._resizeImage(image.uri, dimThumb.width, dimThumb.height, Uploader.THUMB_IMAGE_SPECS.quality);
    //console.log("uriThumb: ", uriThumb);

    const blobFull = await Uploader._uriToBlob(uriFull);
    const blobThumb = await Uploader._uriToBlob(uriThumb);

    return {
      full: blobFull,
      thumb: blobThumb,
    };
  }

};
