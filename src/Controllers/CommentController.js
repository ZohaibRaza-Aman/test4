import { Comment } from "../Models/CommentSchema.js";
import { errHandler, responseHandler } from "../helper/response.js";

const OnComment = (req, res) => {
  const body = req.body;
  Comment.create(body)
    .then((data) => {
      responseHandler(res, data);
    })
    .catch(() => {
      errHandler(res, 5, errHandler);
    });
};

const GetComment = (req, res) => {
  let obj = {};
  let { id } = req.query;
  if (id) {
    obj.postId = id
  }
  Comment.find(obj)
    .then((data) => {
      responseHandler(res, data);
    })
    .catch(() => {
      errHandler(res, 5, errHandler);
    });
};

export {OnComment,GetComment}