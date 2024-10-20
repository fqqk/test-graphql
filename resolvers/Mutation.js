import { authorizeWithGithub } from '../lib.js';
import fetch from 'node-fetch';
import pkg from 'mongodb';
const { ObjectID } = pkg;

const Mutation = {

  async postPhoto(parent, args, { db, currentUser }) {

    if (!currentUser) {
      throw new Error('only an authorized user can post a photo')
    }

    const newPhoto = {
      ...args.input,
      userID: currentUser.githubLogin,
      created: new Date()
    }

    console.log('newPhoto', newPhoto)
    const insertedIds = await db.collection('photos').insertOne(newPhoto)
    console.log('insertedIds', insertedIds)
    newPhoto.id = insertedIds[0]

    return newPhoto

  },

  async tagPhoto(parent, args, { db }) {

    await db.collection('tags')
      .replaceOne(args, args, { upsert: true })

    return db.collection('photos')
      .findOne({ _id: ObjectID(args.photoID) })

  },

  async githubAuth(parent, { code }, { db }) {
    let {
      message,
      access_token,
      avatar_url,
      login,
      name
    } = await authorizeWithGithub({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code
    })
    if (message) {
      throw new Error(message)
    }
    console.log('login')

    let latestUserInfo = {
      name,
      githubLogin: login,
      githubToken: access_token,
      avatar: avatar_url
    }
    
    const result = await db.collection('users').replaceOne(
      { githubLogin: login },
      latestUserInfo,
      { upsert: true }
    );
    let user;
    if (result.upsertedCount > 0) {
      user = await db.collection('users').findOne({ _id: result.upsertedId._id });
    } else {
      user = await db.collection('users').findOne({ githubLogin: login });
    }

    return { user, token: access_token }
  },

  addFakeUsers: async (parent, { count }, { db }) => {
    var randomUserApi = `https://randomuser.me/api/?results=${count}`
    var res = await fetch(randomUserApi).then(res => res.json())
    const usersData = await res.results

    var users = usersData.map(r => ({
      githubLogin: r.login.username,
      name: `${r.name.first} ${r.name.last}`,
      avatar: r.picture.thumbnail,
      githubToken: r.login.sha1
    }))

    // https://www.mongodb.com/ja-jp/docs/manual/reference/method/db.collection.insertMany/
    await db.collection('users').insertMany(users)

    return users
  },

  async fakeUserAuth(parent, { githubLogin }, { db }) {
    var user = await db.collection('users').findOne({ githubLogin })

    if (!user) {
      throw new Error(`Cannot find user with githubLogin "${githubLogin}"`)
    }

    return {
      token: user.githubToken,
      user
    }
  }

}

export default Mutation