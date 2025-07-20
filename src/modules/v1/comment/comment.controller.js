const { Comment, Product } = require("../../../models");
const {
  sendSuccess,
  generatePaginationData,
} = require("../../../utils/apiResponse");
const AppError = require("../../../utils/AppError");
const APIFeatures = require("../../../utils/apiFeatures");
const { generateSignedUrl } = require("../../../services/cloudinaryService");

exports.getComments = async (req, res, next) => {
  try {
    const status = req.query.status;
    const filter = status ? { status } : {};

    const totalComments = await Comment.countDocuments(filter);

    const feature = new APIFeatures(
      Comment.find(filter)
        .populate("userId", "name avatarPublicId")
        .populate("adminReply.adminId", "name")
        .populate("productId", "name slug"),
      req.query
    )
      .sort()
      .paginate();

    const comments = await feature.query.lean();

    const processedComments = comments.map((comment) => ({
      id: comment._id,
      content: comment.content,
      rating: comment.rating,
      status: comment.status,
      createdAt: comment.createdAt,
      author: {
        id: comment.userId._id,
        name: comment.userId.name,
        avatarUrl: generateSignedUrl(comment.userId.avatarPublicId),
      },
      product: {
        id: comment.productId._id,
        name: comment.productId.name,
        slug: comment.productId.slug,
      },
      reply: comment.adminReply
        ? {
            id: comment.adminReply.adminId._id,
            authorName: comment.adminReply.adminId.name,
            content: comment.adminReply.content,
            createdAt: comment.adminReply.createdAt,
          }
        : null,
    }));

    pagination = generatePaginationData(totalComments, feature);

    return sendSuccess(res, "", {
      comments: processedComments,
      pagination,
    });
  } catch (err) {
    next(err);
  }
};
