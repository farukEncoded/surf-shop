const Post = require('../models/post');
const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'dezq14kys',
  api_key: '768241536226873',
  api_secret: process.env.CLOUDINARY_SECRET
})

module.exports = {
   async postIndex(req, res, next){
       let posts = await Post.find({});
       res.render('posts/index', {posts});
   },

   postNew(req, res, next){
    res.render('posts/new');
  },

  //Posts create
  async postCreate(req, res, next){
    req.body.post.images = [];
    //file upload
    for (const file of req.files){
      let image = await cloudinary.v2.uploader.upload(file.path);
      req.body.post.images.push({
        url : image.secure_url,
        public_id : image.public_id
      });
    }
    //use req.body to create a new post
    let post = await Post.create(req.body.post);
    res.redirect(`/posts/${post.id}`);
  },
  //Posts show
  async postShow(req, res, next){
    let post = await Post.findById(req.params.id);
    res.render('posts/show', { post });
  },
  //Posts edit
  async postEdit(req, res, next){
    let post = await Post.findById(req.params.id);
    res.render(`posts/edit`, { post })
  },
  //Posts update
  async postUpdate(req, res, next){
    //find the post by id
    let post = await Post.findById(req.params.id);
    //check if there any images for deletions
    if(req.body.deleteImages && req.body.deleteImages.length){
      //assign deleteImages from req.body to its own variable
      let deleteImages = req.body.deleteImages;
      //loop over deleteImages
      for(const public_id of deleteImages){
        //delete images from cloudinary
        await cloudinary.v2.uploader.destroy(public_id);
        //delete image from post.image
        for(const image of post.images){
          if(image.public_id === public_id){
            let index = post.images.findIndex(image=>image.public_id === public_id);
            post.images.splice(index, 1);
          }
        }
      }
    }
    //check if there any new images to upload
    if(req.files){
      //upload image
      for(const file of req.files){
        let image = await cloudinary.v2.uploader.upload(file.path);
        //add images to post.images array
        post.images.push({
          url : image.secure_url,
          public_id : image.public_id
        });
      }
    }
    //update the post with any new properties
    post.title = req.body.post.title;
    post.description = req.body.post.description;
    post.location = req.body.post.location;
    post.price = req.body.post.price;
    //save the updated post into the db
    post.save();
    //redirect to the show page
    res.redirect(`/posts/${post.id}`);
  },
  //post delete
  async postDestroy(req, res, next){
    let post = await Post.findById(req.params.id);
    for(const image of post.images){
      await cloudinary.v2.uploader.destroy(image.public_id);
    }
    await post.remove();
    res.redirect('/posts');
  }
}