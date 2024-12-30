import * as Yup from "yup";

const YOUTUBE_LINK_REGEX =
  /https?:\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-_]*)(&(amp;)?‌​[\w?‌​=]*)?/;
const LearningMaterialSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string()
    .min(10, "Description should be atleast 10 characters long")
    .required("Description is required"),
  videoUrl: Yup.string()
    .required("Youtube link is required")
    .matches(YOUTUBE_LINK_REGEX, "Invalid Youtube link"),
});
export default LearningMaterialSchema;
