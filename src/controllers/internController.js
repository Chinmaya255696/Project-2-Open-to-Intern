const internModel = require("../models/internModel");
const collegeModel = require("../models/collegeModel");

const isValid = function (value) {
  if (Object.keys(value).length === 0) return false;
  else return true;
};

const isValidValue = function (value) {
  if (typeof value !== "string") return false;
  else if (value.trim().length == 0) return false;
  else return true;
};

const createIntern = async function (req, res) {
  try {
    let data = req.body;
    const { name, email, mobile, collegeName, isDeleted } = req.body;

    if (!isValid(data)) return res.status(400).send({ status: false, message: "No information pass" });
    if (!name)  return res.status(400).send({ status: false, message: "Name is required" });
    if (!isValidValue(name))  return res.status(400).send({ status: false, message: "Name is in wrong format" });
    if (!email) return res.status(400).send({ status: false, message: "email is required" });
    if (!isValidValue(email)) return res.status(400).send({ status: false, message: "email is in wrong format" });
    if (!email.match(/\S+@\S+\.\S+/)) return res.status(400).send({ status: false, message: "Email is invalid" });
    if (!mobile)  return res.status(400).send({ status: false, message: "mobile is required" });
    if (!isValidValue(mobile))  return res.status(400).send({ status: false, message: "mobile is in wrong format" });

    if (!mobile.match(/^\d{10}$/))
      return res
        .status(400)
        .send({ status: false, message: "mobile is invalid" });

    let internEmail = await internModel.findOne({
      $or: [{ email: email }, { mobile: mobile }],
    });

    if (internEmail)  return res.status(400).send({status: false,message: "Email or Mobile number  already exists",});
    if (!collegeName) return res.status(400).send({ status: false, message: "collegeName is required" });
    if (!isValidValue(collegeName)) return res.status(400).send({ status: false, message: "collegeName is in wrong format" });

    if (isDeleted && typeof isDeleted !== "boolean") return res.status(400).send({ status: false, message: "isDeleted is in wrong format" });

    let college = await collegeModel
      .findOne({ $or: [{ name: collegeName }, { fullName: collegeName }], isDeleted : false })
      .select({ _id: 1 });

    if (!college)
      return res
        .status(400)
        .send({ status: false, message: "college  not exists" });
    delete data.collegeName;
    data.collegeId = college._id;

    let intern = await internModel.create(data);
    return res.status(201).send({ status: true, data: intern });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports.createIntern = createIntern;
