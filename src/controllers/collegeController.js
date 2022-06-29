const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");

const isValid = function (value) {
  if (Object.keys(value).length === 0) return false;
  else return true;
};

const isValidValue = function (value) {
  if (typeof value !== "string") return false;
  else if (value.trim().length == 0) return false;
  else return true;
};

const createCollege = async function (req, res) {
  try {
    let data = req.body;
    if (!isValid(data))
      return res
        .status(400)
        .send({ status: false, message: "No information pass" });
    const { name, fullName, logoLink } = req.body;

    if (!name)
      return res
        .status(400)
        .send({ status: false, message: "Name is required" });
    if (!isValidValue(name))
      return res
        .status(400)
        .send({ status: false, message: "Name is in wrong format" });

    if (!fullName)
      return res
        .status(400)
        .send({ status: false, message: "Full Name is required" });
    if (!isValidValue(fullName))
      return res
        .status(400)
        .send({ status: false, message: "Full Name is in wrong format" });

    if (!logoLink)
      return res
        .status(400)
        .send({ status: false, message: "Logo link is required" });
    if (!isValidValue(logoLink))
      return res
        .status(400)
        .send({ status: false, message: "Logo link is in wrong format" });

    try {
      url = new URL(logoLink);
    } catch (err) {
      return res
        .status(400)
        .send({ status: false, message: "Logo link is invalid" });
    }
    if (!logoLink.match(/\.(jpeg|jpg|gif|png)$/))
      return res
        .status(400)
        .send({ status: false, message: "Logo link is not showing image" });

    let collegeName = await collegeModel.findOne({ name: req.body.name });
    if (collegeName)
      return res
        .status(400)
        .send({ status: false, message: "College Name is already exist" });

    let college = await collegeModel.create(data);
    return res.status(201).send({ status: true, data: college });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};


const getCollegeDetails = async function (req, res) {
  const collegeName = req.query.collegeName;

  if (!isValidValue(collegeName))
  return res
    .status(400)
    .send({ status: false, message: "college name is required" })  


  
  const college = await collegeModel.findOne({ name: collegeName , isDeleted: false});
  if (!college)
  return res
    .status(400)
    .send({ status: false, message: " no college found" });
  

  const getCollegeId = college._id;
  const internData = await internModel.find({ collegeId: getCollegeId , isDeleted: false});

  if (internData.length == 0)
  return res
    .status(400)
    .send({ status: false, message: "No interns for this college" });
  const data = { ...college.toJSON(), interns: internData };

  return res.status(200).send({ status: true, data: data });
};

module.exports = {
  createCollege,
  getCollegeDetails,
};
