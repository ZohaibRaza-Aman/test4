import jsonwebtoken from "jsonwebtoken";
import { User, OTP } from "../Models/UserSchema.js";
import { errHandler, responseHandler } from "../helper/response.js";
import MailTransporter from "../Config/mail.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const otpGenrater = async (data) => {
  console.log("h");
  sendmail(data);
};
const transporter = nodemailer.createTransport({
  port: 587,
  host: "smtp.gmail.com",
  secure: false,
  auth: {
    user: process.env.SERVICE,
    pass: process.env.PASS,
  },
});

const sendmail = (data) => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  const mailOptions = {
    from: "muhammadyaseen3294@gmail.com",
    to: data.email,
    subject: "News Website Registration",
    text: otp,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error occurred:", error.message);
    } else {
      console.log(info);
      OTP.create({ UserId: data._id, otp }).then(async (datas) => {
        sendmail(otp, data.email);
        console.log(datas, "hello");
      });
    }
  });
};

const RegisterdUser = async (req, res) => {
  let { phone, email, password, byAdmin = false, role = "user", acsses, selectedKeywords } = req.body;
  if (User && (await User.findOne({ email }))) {
    errHandler(res, 1, 403);
    return;
  } else if (password?.trim().length < 8) {
    errHandler(res, 2, 403);
    return;
  }

  User.create({
    phone,
    email,
    password,
    registerd: byAdmin,
    role,
    selectedKeywords,
    acsses
  })
    .then(async (data) => {
      let { phone, email, registerd, role, _id, createdAt, acsses } = data;
      let token = jsonwebtoken.sign(
        { phone, email, registerd, role, _id, createdAt, acsses },
        process.env.SECRET_KEY
      );

      const otp = Math.floor(1000 + Math.random() * 9000);
      const mailOptions = {
        from: "muhammadyaseen3294@gmail.com",
        to: data.email,
        subject: "News Website Registration",
        text: otp,
      };
      byAdmin ? responseHandler(res, {
        phone,
        email,
        _id,
        registerd,
        createdAt,
        token,
        role,
        acsses
      }) :
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("Error occurred:", error.message);
          } else {
            console.log(info);
            OTP.create({ UserId: data._id, otp }).then(async (datas) => {
              console.log(datas)
              responseHandler(res, {
                phone,
                email,
                _id,
                registerd,
                createdAt,
                token,
                role,
              });
            });
          }
        });;

      console.log("hello");
    })
    .catch((err) => {
      errHandler(res, err, 409);
    });
};

const LoginUser = (req, res) => {
  let { email, password } = req.body;
  if (password.trim().length < 8) {
    errHandler(res, 2, 403);
    return;
  }
  User.findOne({ email, password })
    .then((data) => {
      let { phone, email, registerd, role, _id, createdAt } = data;
      let token = jsonwebtoken.sign(
        { phone, email, registerd, role, _id, createdAt },
        process.env.SECRET_KEY
      );
      responseHandler(res, {
        email,
        phone,
        registerd,
        _id,
        createdAt,
        token,
        role,
      });
    })
    .catch((err) => {
      errHandler(res, 5, 409);
    });
};
const DeleteUser = (req, res) => {
  let { id } = req.query;
  console.log(id);
  User.findByIdAndDelete({ _id: id })
    .then((data) => {
      let { phone, email, registerd, role, _id, createdAt } = data;
      responseHandler(res, {
        email,
        phone,
        registerd,
        _id,
        createdAt,
        role,
      });
    })
    .catch((err) => {
      errHandler(res, 5, 409);
    });
};
const getUser = (req, res) => {
  const { id, registerd, role, phone } = req.query;
  let obj = {};
  if (id) {
    obj._id = id;
  }
  if (registerd) {
    obj.registerd =
      registerd == "yes" ? true : registerd == "no" ? false : false;
  }
  if (role) {
    obj.role = role;
  }
  if (phone) {
    obj.phone = phone;
  }
  User.find(obj)
    .then((data) => {
      responseHandler(res, data);
    })
    .catch((err) => {
      errHandler(res, 5, 409);
    });
};

const forgotPassword = async (req, res) => {
  let { email } = req.body;
  User.findOne({ email })
    .then(async (data) => {
      await otpGenrater(data);
      let token = jsonwebtoken.sign({ email }, process.env.SECRET_KEY);
      responseHandler(res, { _id: data._id, token });
    })
    .catch(() => {
      errHandler(res, 1, 403);
    });
};
const NewPassword = (req, res) => {
  let { id, password } = req.body;
  if (password.trim().length < 8) {
    errHandler(res, 2, 403);
    return;
  }
  User.findByIdAndUpdate({ _id: id }, { password }, { new: true })
    .then((data) => {
      responseHandler(res, data);
    })
    .catch(() => {
      errHandler(res, 1, 403);
    });
};

const changeRole = (req, res) => {
  let { id, role } = req.body;
  User.findByIdAndUpdate({ _id: id }, { role }, { new: true })
    .then((data) => {
      let { phone, email, registerd, _id, role, createdAt } = data;
      responseHandler(res, {
        email,
        registerd,
        _id,
        createdAt,
        role,
        phone,
      });
    })
    .catch((err) => {
      errHandler(res, 5, 409);
    });
};

const otpResend = async (req, res) => {
  const { _id } = req.body;
  OTP.findOne({ UserId: _id })
    .then(async (data1) => {
      User.findOne({ _id }).then(async (data) => {
        await OTP.deleteOne({ UserId: _id });
        otpGenrater(data);
        responseHandler(res, data);
      });
    })
    .catch(() => {
      errHandler(res, "Not Resend otp", 404);
    });
};

const otpVerify = async (req, res) => {
  const { otp, _id } = req.body;
  console.log(req.body, "hwh");
  OTP.findOne({ UserId: _id })
    .then(async (data) => {
      console.log(data, "hh");
      if (otp) {
        if (data.otp == otp) {
          User.findByIdAndUpdate(_id, { registerd: true }, { new: true })
            .then(async (data) => {
              responseHandler(res, data);
              await OTP.deleteOne({ UserId: _id });
            })
            .catch((err) => {
              errHandler(res, 5, 409);
            });
        } else {
          errHandler(res, "please correct otp", 404);
        }
      } else {
        errHandler(res, "please correct otp", 404);
      }
    })
    .catch(() => {
      errHandler(res, "invaild otp", 404);
    });
};

export {
  RegisterdUser,
  LoginUser,
  otpVerify,
  changeRole,
  getUser,
  DeleteUser,
  forgotPassword,
  NewPassword,
  otpResend,
};
