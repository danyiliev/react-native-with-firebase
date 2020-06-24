import * as firebase from 'firebase';
import 'firebase/firestore';
import { get } from 'lodash';

export const checkUsername = username =>
  new Promise((resolve, reject) => {
    const timerId = setTimeout(() => { reject(new Error('DB: Timeout')); }, 5000);
    firebase.firestore().collection('users').where('username', '==', username).get()
      .then((qSnap) => {
        clearTimeout(timerId);
        if (qSnap.empty) {
          resolve(true);
        }
        const uid = get(firebase.auth(), 'currentUser.uid');
        if (firebase.auth().currentUser) {
          const docs = qSnap.docs;
          for (let i = 0; i < docs.length; i += 1) {
            if (docs[i].id === uid) {
              resolve(true);
            }
          }
          resolve(result);
        }
        resolve(false);
      })
      .catch((err) => {
        clearTimeout(timerId);
        reject(err);
      });
  });

export const createPost = userId =>
  new Promise((resolve, reject) => {
    const timerId = setTimeout(() => { reject(new Error('DB: Timeout')); }, 5000);
    firebase.firestore().collection('posts').add({
      userId,
      statusVideoEncoded: 0,
      statusSafeSearch: 0,
      statusPostCompleted: 0,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
      .then((docRef) => {
        clearTimeout(timerId);
        resolve(docRef);
      })
      .catch((err) => {
        clearTimeout(timerId);
        reject(err);
      });
  });

export const deletePost = postId =>
  new Promise((resolve, reject) => {
    const timerId = setTimeout(() => { reject(new Error('DB: Timeout')); }, 5000);
    firebase.firestore().collection('posts').doc(postId).delete()
      .then(() => {
        clearTimeout(timerId);
        resolve();
      })
      .catch((err) => {
        clearTimeout(timerId);
        reject(err);
      });
  });
export const updatePost = (docId, data) =>
  new Promise((resolve, reject) => {
    const timerId = setTimeout(() => { reject(new Error('DB: Timeout')); }, 5000);
    firebase.firestore().collection('posts').doc(docId).update(data)
      .then((docRef) => {
        clearTimeout(timerId);
        resolve(docRef);
      })
      .catch((err) => {
        clearTimeout(timerId);
        reject(err);
      });
  });

export const finishPost = (docId, data) =>
  new Promise((resolve, reject) => {
    const timerId = setTimeout(() => { reject(new Error('DB: Timeout')); }, 5000);
    firebase.firestore().collection('posts').doc(docId).collection('comments')
      .add({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        postId: docId,
        comment: data.description,
        username: data.username,
        userId: firebase.auth().currentUser.uid,
      });
    firebase.firestore().collection('posts').doc(docId).update(data)
      .then((docRef) => {
        clearTimeout(timerId);
        resolve(docRef);
      })
      .catch((err) => {
        clearTimeout(timerId);
        reject(err);
      });
  });

export const getProfile = userId =>
  new Promise((resolve, reject) => {
    const timerId = setTimeout(() => { reject(new Error('DB: Timeout')); }, 5000);
    const uId = userId || get(firebase.auth(), 'currentUser.uid');
    firebase.firestore().collection('users').doc(uId).get()
      .then((docRef) => {
        clearTimeout(timerId);
        resolve(docRef);
      })
      .catch((err) => {
        clearTimeout(timerId);
        reject(err);
      });
  });

export const setProfile = data =>
  new Promise((resolve, reject) => {
    const timerId = setTimeout(() => { reject(new Error('DB: Timeout')); }, 5000);
    const uId = firebase.auth().currentUser.uid;
    firebase.firestore().collection('users').doc(uId).update(data)
      .then(() => {
        clearTimeout(timerId);
        resolve();
      })
      .catch((err) => {
        clearTimeout(timerId);
        reject(err);
      });
  });

export const uploadAvatar = async avatarUri =>
  new Promise(async (resolve, reject) => {
    try {
      const uId = firebase.auth().currentUser.uid;
      const ext = avatarUri.substr(avatarUri.lastIndexOf('.') + 1).toLowerCase();
      const fileRef = firebase.storage().ref().child(`/assets/avatars/${uId}.${ext}`);
      const file = await fetch(avatarUri);
      const blob = await file.blob();
      fileRef.put(blob)
        .then(async (success) => {
          try {
            const url = await success.ref.getDownloadURL();
            resolve(url);
          } catch (err) {
            reject(err);
          }
        },
        (failure) => { reject(failure); });
    } catch (err) {
      reject(err);
    }
  });

export const getUserEmail = () => get(firebase.auth(), 'currentUser.email');

export const updateUserEmail = email =>
  new Promise((resolve, reject) => {
    const timerId = setTimeout(() => { reject(new Error('REQUEST: Timeout')); }, 5000);
    firebase.auth().currentUser.updateEmail(email)
      .then(() => {
        clearTimeout(timerId);
        resolve();
      }).catch((err) => {
        clearTimeout(timerId);
        reject(err);
      });
  });

export const updateUserPassword = password =>
  new Promise((resolve, reject) => {
    const timerId = setTimeout(() => { reject(new Error('REQUEST: Timeout')); }, 5000);
    firebase.auth().currentUser.updatePassword(password)
      .then(() => {
        clearTimeout(timerId);
        resolve();
      }).catch((err) => {
        clearTimeout(timerId);
        reject(err);
      });
  });

export const updateUserProfile = value =>
  new Promise((resolve, reject) => {
    const timerId = setTimeout(() => { reject(new Error('DB: Timeout')); }, 5000);
    firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update(value)
      .then(() => {
        clearTimeout(timerId);
        resolve();
      })
      .catch((err) => {
        clearTimeout(timerId);
        reject(err);
      });
  });

export const followUser = (userId, username, followingUserId, followingUsername) =>
  new Promise((resolve, reject) => {
    const timerId = setTimeout(() => { reject(new Error('DB: Timeout')); }, 5000);
    const checkForExistingConnection = firebase.firestore().collection('connections').where('userId', '==', userId).where('followingUserId', '==', followingUserId);

    checkForExistingConnection.get().then((doc) => {
      if (doc.empty) {
        firebase.firestore().collection('connections').add({
          userId,
          username,
          followingUserId,
          followingUsername,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
          .then(async (docRef) => {
            try {
              const data = await docRef.get();
              clearTimeout(timerId);
              resolve({ id: data.id, ...data.data() });
            } catch (err) {
              clearTimeout(timerId);
              reject(err);
            }
          })
          .catch((err) => {
            clearTimeout(timerId);
            reject(err);
          });
      }
    }).catch((error) => {
      console.log('Error getting document:', error);
    });
  });

export const unfollowUser = connectionId =>
  new Promise((resolve, reject) => {
    const timerId = setTimeout(() => { reject(new Error('DB: Timeout')); }, 5000);
    firebase.firestore().collection('connections').doc(connectionId).delete()
      .then(() => {
        clearTimeout(timerId);
        resolve();
      })
      .catch((err) => {
        clearTimeout(timerId);
        reject(err);
      });
  });

export const checkPassword = async (password, email = false) => {
  const { currentUser } = firebase.auth();
  const credential = firebase.auth.EmailAuthProvider
    .credential(email || currentUser.email, password);
  const result = await currentUser.reauthenticateWithCredential(credential);
  return result;
};

export const updatePassword = newPassword =>
  firebase.auth().currentUser.updatePassword(newPassword);

export const deleteMyAccount = () => firebase.auth().currentUser.delete();

export const blockUser = (userId, blockedUserId, blockedUsername) =>
  new Promise((resolve, reject) => {
    const timerId = setTimeout(() => { reject(new Error('DB: Timeout')); }, 5000);
    firebase.firestore().collection('blocked')
      .add({
        userId,
        blockedUserId,
        blockedUsername,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(async (docRef) => {
        const data = await docRef.get();
        clearTimeout(timerId);
        resolve({ id: data.id, ...data.data() });
      })
      .catch((err) => {
        clearTimeout(timerId);
        reject(err);
      });
  });

export const unblockUser = blockId =>
  new Promise((resolve, reject) => {
    const timerId = setTimeout(() => { reject(new Error('DB: Timeout')); }, 5000);
    firebase.firestore().collection('blocked')
      .doc(blockId)
      .delete()
      .then(() => {
        clearTimeout(timerId);
        resolve();
      })
      .catch((err) => {
        clearTimeout(timerId);
        reject(err);
      });
  });

export const checkBlocked = (userId, blockedUserId) =>
  new Promise((resolve, reject) => {
    const timerId = setTimeout(() => { reject(new Error('DB: Timeout')); }, 5000);
    firebase.firestore()
      .collection('blocked')
      .where('userId', '==', userId)
      .where('blockedUserId', '==', blockedUserId)
      .get()
      .then((qSnap) => {
        clearTimeout(timerId);
        if (qSnap.empty) {
          resolve(false);
        } else {
          const { docs } = qSnap;
          resolve({ id: docs[0].id, ...docs[0].data() });
        }
      })
      .catch((err) => {
        clearTimeout(timerId);
        reject(err);
      });
  });

export const checkBlockedByUser = (userId, blockingUser) =>
  new Promise((resolve, reject) => {
    const timerId = setTimeout(() => { reject(new Error('DB: Timeout')); }, 5000);
    firebase.firestore()
      .collection('users').doc(blockingUser)
      .collection('blocked')
      .where('blockedUserId', '==', userId)
      .get()
      .then((qSnap) => {
        clearTimeout(timerId);
        if (qSnap.empty) {
          resolve(false);
        } else {
          resolve(true);
        }
      })
      .catch((err) => {
        clearTimeout(timerId);
        reject(err);
      });
  });

export const reportToAdmin = data =>
  new Promise((resolve, reject) => {
    const timerId = setTimeout(() => { reject(new Error('DB: Timeout')); }, 5000);
    firebase.firestore().collection('reports').add({
      ...data,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
      .then(() => {
        clearTimeout(timerId);
        resolve();
      })
      .catch((err) => {
        clearTimeout(timerId);
        reject(err);
      });
  });

export const incrementVideoViewCount = (postId) => {
  const shardId = Math.floor(Math.random() * 15);
  const shardRef = firebase.firestore().collection('posts').doc(postId).collection('_counter_shards_')
    .doc(shardId.toString());
  shardRef.set({ viewCount: firebase.firestore.FieldValue.increment(1) }, { merge: true });
};

export const incrementVideoClickCount = (postId) => {
  const shardId = Math.floor(Math.random() * 15);
  const shardRef = firebase.firestore().collection('posts').doc(postId).collection('_counter_shards_')
    .doc(shardId.toString());
  shardRef.set({ clickCount: firebase.firestore.FieldValue.increment(1) }, { merge: true });
};

export const addToWishlist = (postId) => {
  const userId = firebase.auth().currentUser.uid;
  return new Promise((resolve, reject) => {
    const timerId = setTimeout(() => { reject(new Error('DB: Timeout')); }, 5000);
    firebase.firestore().collection('wishlists')
      .add({
        userId,
        postId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(async (docRef) => {
        clearTimeout(timerId);
        const data = await docRef.get();
        resolve({ id: data.id, ...data.data() });
      })
      .catch((err) => {
        clearTimeout(timerId);
        reject(err);
      });
  });
};

export const removeFromWishlist = itemId =>
  new Promise((resolve, reject) => {
    const timerId = setTimeout(() => { reject(new Error('DB: Timeout')); }, 5000);
    firebase.firestore().collection('wishlists').doc(itemId).delete()
      .then(async () => {
        clearTimeout(timerId);
        resolve();
      })
      .catch((err) => {
        clearTimeout(timerId);
        reject(err);
      });
  });

export const checkIsInWishlist = (postId) => {
  const userId = firebase.auth().currentUser.uid;
  return new Promise((resolve, reject) => {
    const timerId = setTimeout(() => { reject(new Error('DB: Timeout')); }, 5000);
    firebase.firestore()
      .collection('wishlists')
      .where('postId', '==', postId)
      .where('userId', '==', userId)
      .get()
      .then((qSnap) => {
        clearTimeout(timerId);
        if (qSnap.empty) {
          resolve(false);
        } else {
          const { docs } = qSnap;
          resolve({ id: docs[0].id, ...docs[0].data() });
        }
      })
      .catch((err) => {
        clearTimeout(timerId);
        reject(err);
      });
  });
};
