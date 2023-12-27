import {
  Article,
  Content,
  Report,
  SubCategory,
} from "../Models/ArticleSchema.js";
import { User } from "../Models/UserSchema.js";
import { errHandler, responseHandler } from "../helper/response.js";
import { Storage } from "../Config/firebase.config.js";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { ObjectId } from 'mongodb';


// const getArticle = (req, res) => {
//   let {
//     approved,
//     keyword,
//     category,
//     search,
//     id,
//     date,
//     reportedBy,
//     publishBy,
//     newsType,
//     type,
//     page,
//     limit,
//     pagenation,
//     subCategory,
//   } = req.query;
//   let obj = { approved: false };
//   if (approved) {
//     obj.approved = true;
//   }
//   if (id) {
//     obj._id = id;
//   }
//   if (keyword) {
//     obj.keyWord = keyword;
//   }
//   if (category) {
//     obj.topic = category;
//   }
//   if (search) {
//     let regex = new RegExp(search, "i");
//     obj.title = regex;
//   }
//   if (date) {
//     obj.date = date;
//   }
//   if (reportedBy) {
//     obj.reportedBy = reportedBy;
//   }
//   if (publishBy) {
//     obj.publishBy = publishBy;
//   }
//   if (newsType) {
//     obj.newsType = newsType;
//   }
//   if (type) {
//     obj.type = type;
//   }
//   if (subCategory) {
//     obj.subCategory = subCategory;
//   }
//   page = Number(page || 1);
//   limit = Number(limit || 6);
//   const skip = (page - 1) * limit;
//   console.log(obj)
//   if (pagenation) {
//     Article.find(obj)
//       .skip(skip)
//       .limit(limit)
//       .then((data) => {
//         responseHandler(res, data);
//       });
//   } else {
//     Article.find(obj).then((data) => {
//       responseHandler(res, data);
//     });
//   }
// };

const getArticle = (req, res) => {
  let {
    approved,
    keyword,
    category,
    search,
    id,
    date,
    reportedBy,
    publishBy,
    newsType,
    type,
    page,
    limit,
    pagenation,
    subCategory,
    status
  } = req.query;

  let obj = { approved: false };

  if (approved) {
    obj.approved = true;
  }
  if (id) {
    obj._id = id;
  }
  if (status) {
    obj.status = status;
  }
  if (keyword) {
    obj.keyWord = keyword;
  }
  if (category) {
    obj.topic = category;
  }
  if (search) {
    let regex = new RegExp(search, "i");
    obj.title = regex;
  }

  if (date) {
    // Check if date is not an empty string and is a string
    if (typeof date === 'string' && date.trim() !== '') {
      // Split the date range string into an array and remove empty values
      const dateRange = date.split(',').filter(Boolean);

      if (dateRange.length === 2) {
        // Use $gte and $lte for date range filtering
        obj.date = { $gte: dateRange[0], $lte: dateRange[1] };
      } else {
        // console.error('Invalid date range format. Using default date range.');
        // Handle the case where date range is not in the expected format
        // You can set default values or throw an error, depending on your requirements
      }
    }
  }

  if (reportedBy) {
    obj.reportedBy = reportedBy;
  }
  if (publishBy) {
    obj.publishBy = publishBy;
  }
  if (newsType) {
    obj.newsType = newsType;
  }
  if (type) {
    obj.type = type;
  }
  if (subCategory) {
    obj.subCategory = subCategory;
  }

  page = Number(page || 1);
  limit = Number(limit || 6);
  const skip = (page - 1) * limit;

  if (pagenation) {
    Article.find(obj)
      .skip(skip)
      .limit(limit)
      .then((data) => {
        responseHandler(res, data);
      })
      .catch((error) => {
        errHandler(res, error, 500);
      });
  } else {
    Article.find(obj)
      .then((data) => {
        responseHandler(res, data);
      })
      .catch((error) => {
        errHandler(res, error, 500);
      });
  }
};




const DeleteArticle = (req, res) => {
  const { id } = req.query;
  // console.log(id);
  Article.findByIdAndDelete({ _id: id }).then((data) => {
    responseHandler(res, data);
  });
};
const ReportArticle = (req, res) => {
  const { adminId, userId, question, articleId } = req.body;
  // console.log(req.body);
  Report.create({ adminId, userId, articleId, question })
    .then(async (data) => {
      await Article.findByIdAndUpdate(
        { _id: articleId },
        { approved: true },
        { new: true }
      );
      responseHandler(res, data);
    })
    .catch((err) => {
      errHandler(res, err, 404);
    });
};
const GetReportArticle = (req, res) => {
  const { adminId, userId } = req.query;
  let obj = {};
  if (adminId) {
    obj.adminId = adminId;
  }
  if (userId) {
    obj.userId = userId;
  }
  Report.find(obj).then(async (data) => {
    responseHandler(res, data);
  });
};
const answerReportArticle = (req, res) => {
  const { id, answer } = req.body;
  Report.findByIdAndUpdate({ _id: id }, { answer }, { new: true }).then(
    async (data) => {
      responseHandler(res, data);
    }
  );
};
const adminGetArticle = (req, res) => {
  const { id } = req.params;
  User.findOne({ _id: id, role: "admin" })
    .then(() => {
      Article.find({ approved: false }).then((data) => {
        responseHandler(res, data);
      });
    })
    .catch(() => {
      errHandler(res, "not Found", 404);
    });
};
// const PostArticle = async (req, res) => {
//   const {
//     title,
//     discription,
//     topic,
//     keyWord,
//     language,
//     reportedBy,
//     publishBy,
//     newsType,
//     image,
//     type,
//     subCategory,
//     acsses,
//     comment
//   } = req.body;
//   // console.log(body);
//   const { id } = req.params;
//   let date = new Date();
//   date = JSON.stringify(date).split("T")[0].split('"')[1];
//   Article.create({
//     UserID: id,
//     title,
//     discription,
//     topic,
//     keyWord,
//     language,
//     reportedBy,
//     publishBy,
//     newsType,
//     image,
//     date,
//     type,
//     subCategory,
//     acsses,
//     comment
//   })
//     .then((data) => {
//       responseHandler(res, data);
//     })
//     .catch((err) => {
//       errHandler(res, JSON.stringify(err), 403);
//     });
// };
const PostArticle = async (req, res) => {
  const {
    title,
    discription,
    topic,
    keyWord,
    language,
    reportedBy,
    publishBy,
    newsType,
    image,
    type,
    subCategory,
    acsses,
    comment
  } = req.body;

  const { id } = req.params;
  let date = new Date();
  date = JSON.stringify(date).split("T")[0].split('"')[1];

  let idPrefix = "LOK";

  if (newsType === "breakingNews") {
    idPrefix += "BR";
  } else if (newsType === "topStories") {
    idPrefix += "TS";
  }

  const customId = idPrefix + id + Date.now();

  console.log('Custom ID:', customId);

  Article.create({
    _id: customId, // Use the ObjectId as _id
    UserID: id,
    title,
    discription,
    topic,
    keyWord,
    language,
    reportedBy,
    publishBy,
    newsType,
    image,
    date,
    type,
    subCategory,
    acsses,
    comment
  })
    .then((data) => {
      responseHandler(res, data);
    })
    .catch((err) => {
      errHandler(res, JSON.stringify(err), 403);
    });
};

const imageUpload = async (req, res) => {
  // console.log(req.body, "ff");
  // console.log(req.file ? req.file : null);
  const metadata = {
    contentType: req.file.mimetype,
  };
  const storageRef = ref(
    Storage,
    `uploads/${req.file.fieldname + "_" + Date.now()}`
  );
  // console.log(storageRef);
  //     const bytes = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64, 0x21]);
  await uploadBytesResumable(storageRef, req.file.buffer, metadata).then(
    (snap) => {
      // console.log("success");
      getDownloadURL(storageRef).then((url) => {
        responseHandler(res, { image: url });
      });
    }
  );
};
const approvedArticle = (req, res) => {
  let { id } = req.params;
  let body = req.body;

  Article.findByIdAndUpdate({ _id: id }, body, { new: true })
    .then((data) => {
      responseHandler(res, {
        data,
      });
    })
    .catch((err) => {
      errHandler(res, 5, 409);
    });
};

const ArticleContent = (req, res) => {
  const { id } = req.query;
  const { text, type } = req.body;
  Content.create({ type, adminId: id, text })
    .then((data) => {
      responseHandler(res, data);
    })
    .catch(() => {
      errHandler(res, "tag was not created", 403);
    });
};
const ArticleContentDelete = (req, res) => {
  const { id } = req.body;
  Content.findByIdAndDelete({ _id: id })
    .then((data) => {
      responseHandler(res, data);
    })
    .catch(() => {
      errHandler(res, "Article Content was not Deleted", 403);
    });
};
const ArticleContentGet = (req, res) => {
  let { id, adminId, type, page, limit } = req.query;
  let obj = {};
  if (id) {
    obj.id = id;
  }
  if (type) {
    obj.type = type;
  }
  if (adminId) {
    obj.adminId = adminId;
  }
  Content.find(obj)
    .then((data) => {
      responseHandler(res, data);
    })
    .catch(() => {
      errHandler(res, "Article Content was not Deleted", 403);
    });
};

const createSubCategory = async (req, res) => {
  let body = req.body;
  // console.log(body);
  if (SubCategory && (await SubCategory.findOne({ text: body.text }))) {
    errHandler(res, "Sub Category ALready Axist", 401);
    return;
  }
  SubCategory.create(body)
    .then((data) => {
      responseHandler(res, data);
    })
    .catch((err) => {
      // console.log(err);
      errHandler(res, "Sub Category Was Not Create", 403);
    });
};

const getSubCategory = (req, res) => {
  let { category } = req.query;
  let obj = {};
  if (category) {
    obj.category = category;
  }
  SubCategory.find(obj)
    .then((data) => {
      responseHandler(res, data);
    })
    .catch(() => {
      errHandler(res, "Sub Category Was Not Create", 403);
    });
};

export {
  getArticle,
  adminGetArticle,
  PostArticle,
  approvedArticle,
  DeleteArticle,
  imageUpload,
  ReportArticle,
  GetReportArticle,
  answerReportArticle,
  ArticleContent,
  ArticleContentDelete,
  ArticleContentGet,
  createSubCategory,
  getSubCategory,
};
