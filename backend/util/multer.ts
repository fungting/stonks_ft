import multer from "multer";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "assets/uploads");
	},
	filename: function (req, file, cb) {
		cb(null, `${file.fieldname}-${file.originalname.split(".")[0]}-${Date.now()}.${file.mimetype.split("/")[1]}`);
	},
});
const upload = multer({ storage });

export const multerSingle = upload.single("image");
