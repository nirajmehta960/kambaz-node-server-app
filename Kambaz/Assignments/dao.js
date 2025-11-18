import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function AssignmentsDao(db) {
  async function findAssignmentsForCourse(courseId) {
    try {
      const assignments = await model.find({ course: courseId });
      return assignments;
    } catch (error) {
      console.error("Error in findAssignmentsForCourse:", error);
      throw error;
    }
  }

  async function createAssignment(assignment) {
    try {
      const newAssignment = { ...assignment, _id: uuidv4() };
      const createdAssignment = await model.create(newAssignment);
      return createdAssignment;
    } catch (error) {
      console.error("Error in createAssignment:", error);
      throw error;
    }
  }

  async function deleteAssignment(assignmentId) {
    try {
      const result = await model.findByIdAndDelete(assignmentId);
      return { status: "ok" };
    } catch (error) {
      console.error("Error in deleteAssignment:", error);
      throw error;
    }
  }

  async function updateAssignment(assignmentId, assignmentUpdates) {
    try {
      const updatedAssignment = await model.findByIdAndUpdate(
        assignmentId,
        { $set: assignmentUpdates },
        { new: true }
      );
      if (!updatedAssignment) {
        return null;
      }
      return updatedAssignment;
    } catch (error) {
      console.error("Error in updateAssignment:", error);
      throw error;
    }
  }

  return {
    findAssignmentsForCourse,
    createAssignment,
    deleteAssignment,
    updateAssignment,
  };
}