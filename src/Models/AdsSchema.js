import mongoose from "mongoose";

const AdsSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    imgLink: {
      type: String,
      required: true,
    },
    noAds: {
      type: Number,
      default: 0,
    },
    noOfImpression: {
      type: Number,
      default: 0,
    },
    link: {
      type: String,
    },
    slugName: {
      type: String,
      required: true,
    },
    StartAt: {
      type: String,
      required: true,
    },
    EndAt: {
      type: String,
      required: true,
    },
    Price: {
      type: String,
      required: true,
    },
    side: {
      type: String,
      // required:true
      enum: ["top", "mid", "bottom"]
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

const AdsS = mongoose.model("Ad", AdsSchema);
export { AdsS };
