const { Comment } = require("../models");
const APIFeatures = require("../utils/apiFeatures");
const { generatePaginationData } = require("../utils/apiResponse");
const { generateSignedUrl } = require("./cloudinaryService");

exports.getCommentsWithPagination = async (
  filter = {},
  queryParams,
  options = {}
) => {
  const { includeProduct = true } = options;

  const totalComments = await Comment.countDocuments(filter);

  let query = Comment.find(filter)
    .populate("userId", "name avatarPublicId")
    .populate("adminReply.adminId", "name");

  if (includeProduct) {
    query = query.populate("productId", "name slug");
  }
  
  const feature = new APIFeatures(query, queryParams).sort().paginate();

  const comments = await feature.query.lean();

  const processedComments = comments.map((comment) => {
    const processed = {
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

      reply: comment.adminReply
        ? {
            id: comment.adminReply.adminId._id,
            authorName: comment.adminReply.adminId.name,
            content: comment.adminReply.content,
            createdAt: comment.adminReply.createdAt,
          }
        : null,
    };

    if (includeProduct) {
      processed.product = {
        id: comment.productId._id,
        name: comment.productId.name,
        slug: comment.productId.slug,
      };
    }

    return processed;
  });

  const pagination = generatePaginationData(totalComments, feature);

  return {
    comments: processedComments,
    pagination,
  };
};
