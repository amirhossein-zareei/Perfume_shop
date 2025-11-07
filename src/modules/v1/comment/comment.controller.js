const { Comment, Product } = require("../../../models");
const { sendSuccess } = require("../../../utils/apiResponse");
const AppError = require("../../../utils/AppError");
const {
  getCommentsWithPagination,
} = require("../../../services/commentService");

exports.getComments = async (req, res, next) => {
  try {
    const status = req.query.status;
    const filter = status ? { status } : {};

    const { comments, pagination } = await getCommentsWithPagination(
      filter,
      req.query
    );

    return sendSuccess(res, "", {
      comments,
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

    return sendSuccess(res, "Comment updated successfully.", {
      comment: comment.toObject(),
    });
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
