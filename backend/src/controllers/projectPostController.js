const fs = require('fs');
const path = require('path');
const ProjectPost = require('../models/ProjectPost');
const User = require('../models/User'); // Asumiendo que quieres asociar posts a usuarios
const { validationResult } = require('express-validator');

// @desc    Obtener todas las publicaciones de proyectos (público)
// @route   GET /api/project-posts
// @access  Public
exports.getProjectPosts = async (req, res) => {
  try {
    const posts = await ProjectPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

// @desc    Obtener una publicación de proyecto por ID (público)
// @route   GET /api/project-posts/:id
// @access  Public
exports.getProjectPostById = async (req, res) => {
  try {
    const post = await ProjectPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Publicación no encontrada' });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Publicación no encontrada' });
    }
    res.status(500).send('Error del servidor');
  }
};

// @desc    Crear una nueva publicación de proyecto (admin)
// @route   POST /api/admin/project-posts
// @access  Private/Admin
exports.createProjectPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content, youtubeLink } = req.body; // Added youtubeLink

  try {
    const mainImage = req.files.mainImage ? `/uploads/${req.files.mainImage[0].filename}` : ''; // Handle mainImage
    const images = req.files.images ? req.files.images.map(file => `/uploads/${file.filename}`) : [];
    const attachments = req.files.attachments ? req.files.attachments.map(file => ({ name: file.originalname, path: `/uploads/${file.filename}` })) : []; // Changed from pdfDocuments

    const newPost = new ProjectPost({
      title,
      content,
      mainImage, // Added mainImage
      images,
      attachments, // Changed from pdfDocuments
      youtubeLink, // Added youtubeLink
      // author: req.user.id // Asignar el autor si el admin está logueado
    });

    const post = await newPost.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

// @desc    Actualizar una publicación de proyecto (admin)
// @route   PUT /api/admin/project-posts/:id
// @access  Private/Admin
exports.updateProjectPost = async (req, res) => {
  const { title, content, youtubeLink, deletedImages: deletedImagesJSON, deletedAttachments: deletedAttachmentsJSON } = req.body; // Added deletedAttachments

  try {
    let post = await ProjectPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Publicación no encontrada' });
    }

    // 1. Handle image deletion
    if (deletedImagesJSON) {
      const deletedImages = JSON.parse(deletedImagesJSON);
      if (Array.isArray(deletedImages) && deletedImages.length > 0) {
        deletedImages.forEach(imagePath => {
          const fullPath = path.join(__dirname, '../..', imagePath);
          if (fs.existsSync(fullPath)) {
            try {
              fs.unlinkSync(fullPath);
            } catch (err) {
              console.error(`Error deleting file: ${fullPath}`, err);
            }
          }
        });
        post.images = post.images.filter(img => !deletedImages.includes(img));
      }
    }

    // 2. Handle main image update
    let mainImage = post.mainImage;
    if (req.files.mainImage) {
      if (post.mainImage) {
        const oldPath = path.join(__dirname, '../..', post.mainImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      mainImage = `/uploads/${req.files.mainImage[0].filename}`;
    } else if (req.body.mainImage === '') {
      if (post.mainImage) {
        const oldPath = path.join(__dirname, '../..', post.mainImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      mainImage = '';
    }

    // Calculate the new images array
    let currentImages = post.images || [];
    if (deletedImagesJSON) {
      const deletedImages = JSON.parse(deletedImagesJSON);
      currentImages = currentImages.filter(img => !deletedImages.includes(img));
    }
    if (req.files.images) {
      const newImagePaths = req.files.images.map(file => `/uploads/${file.filename}`);
      currentImages = [...currentImages, ...newImagePaths];
    }

    // Calculate the new attachments array
    let currentAttachments = (post.attachments || []).map(att => {
        // Data migration: if 'att' is a string (old format), convert it to the new object format.
        if (typeof att === 'string') {
            return { name: att.split('/').pop(), path: att };
        }
        // Otherwise, it's already in the correct object format.
        return att;
    });

    if (deletedAttachmentsJSON) {
      const deletedPaths = JSON.parse(deletedAttachmentsJSON);
      if (Array.isArray(deletedPaths) && deletedPaths.length > 0) {
        // Delete files from filesystem
        await Promise.all(deletedPaths.map(async (filePath) => {
          try {
            const fullPath = path.join(__dirname, '..', '..', filePath);
            await fs.access(fullPath);
            await fs.unlink(fullPath);
          } catch (error) {
            console.warn(`Could not delete attachment file ${filePath}:`, error.message);
          }
        }));
        // Filter out from the array in the post
        currentAttachments = currentAttachments.filter(att => att && !deletedPaths.includes(att.path));
      }
    }

    if (req.files.attachments) {
      const newAttachments = req.files.attachments.map(file => ({
        name: file.originalname,
        path: `/uploads/${file.filename}`
      }));
      currentAttachments = [...currentAttachments, ...newAttachments];
    }

    // 5. Update fields
    post.title = title !== undefined ? title : post.title;
    post.content = content !== undefined ? content : post.content;
    post.mainImage = mainImage;
    post.youtubeLink = youtubeLink !== undefined ? youtubeLink : post.youtubeLink;

    const updatedPost = await ProjectPost.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: post.title,
          content: post.content,
          mainImage: post.mainImage,
          images: currentImages, // Pass the calculated array directly
          attachments: currentAttachments, // Pass the calculated array directly
          youtubeLink: post.youtubeLink,
        },
      },
      { new: true, runValidators: true }
    );

    res.json(updatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

// @desc    Eliminar una publicación de proyecto (admin)
// @route   DELETE /api/admin/project-posts/:id
// @access  Private/Admin
exports.deleteProjectPost = async (req, res) => {
  try {
    const post = await ProjectPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Publicación no encontrada' });
    }

    const deletionPromises = [];

    if (post.mainImage) {
      deletionPromises.push(
        fs.unlink(path.join(__dirname, '../..', post.mainImage)).catch(err => console.warn(`Could not delete main image ${post.mainImage}:`, err.message))
      );
    }

    if (post.images && post.images.length > 0) {
      post.images.forEach(imagePath => {
        deletionPromises.push(
          fs.unlink(path.join(__dirname, '../..', imagePath)).catch(err => console.warn(`Could not delete gallery image ${imagePath}:`, err.message))
        );
      });
    }

    if (post.attachments && post.attachments.length > 0) {
      post.attachments.forEach(attachment => {
        deletionPromises.push(
          fs.unlink(path.join(__dirname, '../..', attachment.path)).catch(err => console.warn(`Could not delete attachment ${attachment.path}:`, err.message))
        );
      });
    }

    await Promise.all(deletionPromises);

    await ProjectPost.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Publicación eliminada correctamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};