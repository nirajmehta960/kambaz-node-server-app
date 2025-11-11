import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
  function findAssignmentsForCourse(courseId) {
    return db.assignments.filter((assignment) => assignment.course === courseId);
  }

  function createAssignment(assignment) {
    const newAssignment = { ...assignment, _id: uuidv4() };
    db.assignments = [...db.assignments, newAssignment];
    return newAssignment;
  }

  function deleteAssignment(assignmentId) {
    db.assignments = db.assignments.filter((assignment) => assignment._id !== assignmentId);
    return { status: "ok" };
  }

  function updateAssignment(assignmentId, assignmentUpdates) {
    const assignment = db.assignments.find((a) => a._id === assignmentId);
    if (!assignment) {
      return null;
    }
    Object.assign(assignment, assignmentUpdates);
    return assignment;
  }

  return {
    findAssignmentsForCourse,
    createAssignment,
    deleteAssignment,
    updateAssignment,
  };
}