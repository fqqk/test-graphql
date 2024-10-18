module.exports = {
  Mutation: {
    // parent is mutation object
    postPhoto(parent, args) {
      var newPhoto = {
        id: _id++,
        ...args.input,
        createdAt: new Date()
      }
      photos.push(newPhoto)
      return newPhoto
    }
  }
}