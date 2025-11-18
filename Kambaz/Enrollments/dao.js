import model from "./model.js";

export default function EnrollmentsDao(db) {
  async function findCoursesForUser(userId) {
    try {
      const enrollments = await model.find({ user: userId }).populate("course");
      // Filter out null courses in case populate fails for some enrollments
      return enrollments
        .map((enrollment) => enrollment.course)
        .filter((course) => course !== null && course !== undefined);
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
      // Filter out null users in case populate fails for some enrollments
      return enrollments
        .map((enrollment) => enrollment.user)
        .filter((user) => user !== null && user !== undefined);
    } catch (error) {
      console.error("Error in findUsersForCourse:", error);
      throw error;
    }
  }

  async function enrollUserInCourse(user, course) {
    try {
      const newEnrollment = { user, course, _id: `${user}-${course}` };
      return await model.create(newEnrollment);
    } catch (error) {
      console.error("Error in enrollUserInCourse:", error);
      throw error;
    }
  }

  async function unenrollUserFromCourse(user, course) {
    try {
      return await model.deleteOne({ user, course });
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
