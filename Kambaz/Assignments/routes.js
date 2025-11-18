import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app, db) {
  const dao = AssignmentsDao(db);

  const findAssignmentsForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const assignments = await dao.findAssignmentsForCourse(courseId);
      res.json(assignments);
    } catch (error) {
      console.error("Error in findAssignmentsForCourse route:", error);
      res.status(500).json({ error: "Failed to fetch assignments" });
    }
  };

  const createAssignmentForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const assignment = {
        ...req.body,
        course: courseId,
      };
      const newAssignment = await dao.createAssignment(assignment);
      res.json(newAssignment);
    } catch (error) {
      console.error("Error in createAssignmentForCourse route:", error);
      res.status(500).json({ error: "Failed to create assignment" });
    }
  };

  const deleteAssignment = async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const status = await dao.deleteAssignment(assignmentId);
      res.json(status);
    } catch (error) {
      console.error("Error in deleteAssignment route:", error);
      res.status(500).json({ error: "Failed to delete assignment" });
    }
  };

  const updateAssignment = async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const assignmentUpdates = req.body;
      const updatedAssignment = await dao.updateAssignment(
        assignmentId,
        assignmentUpdates
      );
      if (!updatedAssignment) {
        res.status(404).json({ message: `Assignment not found` });
        return;
      }
      res.json(updatedAssignment);
    } catch (error) {
      console.error("Error in updateAssignment route:", error);
      res.status(500).json({ error: "Failed to update assignment" });
    }
  };

  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.post("/api/courses/:courseId/assignments", createAssignmentForCourse);
  app.delete("/api/assignments/:assignmentId", deleteAssignment);
  app.put("/api/assignments/:assignmentId", updateAssignment);
}