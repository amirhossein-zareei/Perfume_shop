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

    const pagination = generatePaginationData(totalComments, feature);

    return sendSuccess(res, "", {
      comments: processedComments,
      pagination,
    });
  } catch (err) {
    next(err);
  }
};

exports.changeCommentStatus = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { status: newStatus, replyContent } = req.body;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new AppError("Comment not found.", 404);
    }

    const oldStatus = comment.status;
    comment.status = newStatus;

    if (replyContent) {
      comment.adminReply = {
        adminId: req.user._id,
        content: replyContent,
        createdAt: new Date(),
      };
    }
    await comment.save();

    const isApproved = (status) => status === "approved";

    const wasApproved = isApproved(oldStatus);
    const isNowApproved = isApproved(newStatus);

    const ratingChange =
      wasApproved === isNowApproved
        ? 0
        : isNowApproved
        ? comment.rating
        : -comment.rating;

    if (ratingChange !== 0) {
      await Product.findByIdAndUpdate(comment.productId, {
        $inc: {
          ratingsCount: ratingChange > 0 ? 1 : -1,
          ratingsSum: ratingChange,
        },
      });
    }

    return sendSuccess(res, "Comment updated successfully.", comment);
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      throw new AppError("Comment not found.", 404);
    }

    if (deletedComment.status === "approved") {
      await Product.findByIdAndUpdate(deletedComment.productId, {
        $inc: {
          ratingsCount: -1,
          ratingsSum: -deletedComment.rating,
        },
      });
    }

    return sendSuccess(res, "Comment deleted successfully.");
  } catch (err) {
    next(err);
  }
};
