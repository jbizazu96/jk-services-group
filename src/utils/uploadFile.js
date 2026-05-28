/*
|--------------------------------------------------------------------------
| FIREBASE FILE UPLOAD HELPER
|--------------------------------------------------------------------------
|
| FEATURES:
| - Resumable Uploads
| - Upload Progress
| - Returns Download URL
| - Returns Storage Path
|
|--------------------------------------------------------------------------
*/

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import { storage } from "@/lib/firebase";

/*
|--------------------------------------------------------------------------
| MAIN FUNCTION
|--------------------------------------------------------------------------
*/

export const uploadFile = ({
  file,
  requestId,
  onProgress,
}) => {

  return new Promise((resolve, reject) => {

    /*
    |--------------------------------------------------------------------------
    | STORAGE PATH
    |--------------------------------------------------------------------------
    */

    const fileName = `${Date.now()}-${file.name}`;

    const storagePath =
      `client-uploads/${requestId}/${fileName}`;

    const storageRef = ref(storage, storagePath);

    /*
    |--------------------------------------------------------------------------
    | START UPLOAD
    |--------------------------------------------------------------------------
    */

    const uploadTask = uploadBytesResumable(
      storageRef,
      file
    );

    /*
    |--------------------------------------------------------------------------
    | TRACK PROGRESS
    |--------------------------------------------------------------------------
    */

    uploadTask.on(
      "state_changed",

      (snapshot) => {

        const progress =
          (snapshot.bytesTransferred /
            snapshot.totalBytes) * 100;

        if (onProgress) {
          onProgress(Math.round(progress));
        }
      },

      (error) => {
        reject(error);
      },

      async () => {

        try {

          const downloadURL =
            await getDownloadURL(
              uploadTask.snapshot.ref
            );

          resolve({
            url: downloadURL,
            path: storagePath,
            name: file.name,
            type: file.type,
            size: file.size,
          });

        } catch (error) {
          reject(error);
        }
      }
    );
  });
};