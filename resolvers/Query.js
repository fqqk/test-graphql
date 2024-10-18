module.exports = {
  totalPhotos: () => photos.length,

  allPhotos: (args) => {
    console.log(args.after)
    if (args.after) {
      return photos.filter(p => p.createdAt > args.after)
    } else {
      return photos
    }
  }
}