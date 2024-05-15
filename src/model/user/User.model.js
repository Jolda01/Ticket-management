const {UserSchema} = require('./User.schema')

const insertUser = (userObj) => {
    return new Promise((resolve, reject) => {
        UserSchema(userObj)
          .save()
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      });
    };
    const getUserByEmail = async (email) => {
        try {
            if (!email) return false;
            
            const user = await UserSchema.findOne({ email });
            return user;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };
    const getUserById = async (_id) => {
        if (!_id) {
          throw new Error("User ID is required");
        }
      
        try {
          const user = await UserSchema.findOne({ _id });
          if (!user) {
            throw new Error("User not found");
          }
          return user;
        } catch (error) {
          console.error("Error fetching user by ID:", error);
          throw error;
        }
      };
      const updatePassword = async (email, newhashedPass) => {
        try {
          const updatedUser = await UserSchema.findOneAndUpdate(
            { email },
            { $set: { password: newhashedPass } },
            { new: true }
          );
          return updatedUser;
        } catch (error) {
          console.error("Error updating password:", error);
          throw error;
        }
      };
      
      
module.exports={
    insertUser,
    getUserByEmail,
    getUserById,
    updatePassword
}