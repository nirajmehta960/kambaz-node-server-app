import model from "./model.js";

export default function EnrollmentsDao(db) {
  async function findCoursesForUser(userId) {
    try {
      const enrollments = await model.find({ user: userId }).populate("course");
      return enrollments.map((enrollment) => enrollment.course);
    } catch (error) {
      console.error("Error in findCoursesForUser:", error);
      throw error;
    }
  }

  async function findUsersForCourse(courseId) {
    try {
      const enrollments = await model
        .find({ course: courseId })
        .populate("user");
      return enrollments.map((enrollment) => enrollment.user);
    } catch (error) {
      console.error("Error in findUsersForCourse:", error);
      throw error;
    }
  }

  async function enrollUserInCourse(user, course) {
    try {
      const newEnrollment = { user, course, _id: `${user}-${course}` };
      return model.create(newEnrollment);
    } catch (error) {
      console.error("Error in enrollUserInCourse:", error);
      throw error;
    }
  }

  async function unenrollUserFromCourse(user, course) {
    try {
      return model.deleteOne({ user, course });
    } catch (error) {
      console.error("Error in unenrollUserFromCourse:", error);
      throw error;
    }
  }

  return {
    findCoursesForUser,
    findUsersForCourse,
    enrollUserInCourse,
    unenrollUserFromCourse,
  };
}
