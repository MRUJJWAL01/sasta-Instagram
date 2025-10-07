const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
     mobile: {
      type: String,
      unique: true,
      sparse: true, 
      minlength: 10,
      maxlength: 10,
    },
    email: {
      type: String,
      sparse: true, 
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("validate",function(next){
  if((this.email && this.mobile) || (!this.email && !this.mobile) ){
    next(new Error("Provide ether email or mobile, but not both or neigther"))
  }else{
    next();
  }

})
userSchema.pre("save", async function (next) {
  let hashPass = await bcrypt.hash(this.password, 10);
  this.password = hashPass;
  next();
});

userSchema.methods.JWTTokenGeneration = function () {
  return jwt.sign({ id: this._id }, process.env.Jwt_Secret, {
    expiresIn: "1h",
  });
};

userSchema.methods.comparePassword = async function (plainPass) {
  return await bcrypt.compare(plainPass, this.password);
};

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
