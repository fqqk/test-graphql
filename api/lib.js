import fetch from 'node-fetch';
import fs from 'fs';
import { error } from 'console';

export const findBy = (value, array, field='id') =>
	array[array.map(item=>item[field]).indexOf(value)]

export const generateFakeUsers = count => 
    fetch(`https://randomuser.me/api/?results=${count}`)
    .then(res => res.json())

async function requestGithubToken(credentials) {
  const response = await fetch(
    'https://github.com/login/oauth/access_token',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify(credentials)
    }
  );
  const token = await response.json();
  if (token.error) {
    throw new Error(JSON.stringify(token))
  }
  return token
};

async function requestGithubUserAccount(token){ 
  const userResponse = await fetch(`https://api.github.com/user`, {
    headers: {
      Authorization: `token ${token}`
    }
  })
  const userData = await userResponse.json()
  if (userData.message) {
    throw new Error(JSON.stringify(userData))
  }
  return userData
}
        
export const authorizeWithGithub = async credentials => {
  const { access_token } = await requestGithubToken(credentials)
  const githubUser = await requestGithubUserAccount(access_token)
  return { ...githubUser, access_token }
}

const saveFile = (stream, path) => 
    new Promise((resolve, reject) => {
        stream.on('error', error => {
            if (stream.truncated) {
                fs.unlinkSync(path)
            }
            reject(error)
        }).on('end', resolve)
        .pipe(fs.createWriteStream(path))
    })

export const uploadFile = async (file, path) => {
    const { stream } = await file
    return saveFile(stream, path)
}
